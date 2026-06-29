import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SaveSchema = z
  .object({
    score: z.number().int().min(0).max(500_000),
    coinsEarned: z.number().int().min(0).max(10_000),
    distance: z.number().int().min(0).max(100_000),
    world: z.string().max(64).optional().default("tropical_lagoon"),
    bossDefeated: z.boolean().optional().default(false),
  })
  .superRefine((d, ctx) => {
    // Plausibility checks: client-reported metrics must be consistent with distance.
    // Engine produces ~score ≤ speed*time*mult + coin bonuses; coins ≤ ~distance/2.
    const maxScore = d.distance * 50 + (d.bossDefeated ? 5_000 : 0) + 2_000;
    const maxCoins = Math.ceil(d.distance / 2) + 50;
    if (d.score > maxScore) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Score implausible for distance" });
    }
    if (d.coinsEarned > maxCoins) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Coins implausible for distance" });
    }
    if (d.bossDefeated && d.distance < 600) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Boss cannot be defeated before reaching it" });
    }
  });

// XP curve: 100 * level
function xpForLevel(level: number) {
  return 100 * level;
}
function levelFromXp(xp: number) {
  let lvl = 1;
  let rem = xp;
  while (rem >= xpForLevel(lvl)) {
    rem -= xpForLevel(lvl);
    lvl += 1;
  }
  return lvl;
}

export const saveGameRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => SaveSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // ----- profile (coins / highest_score) -----
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("coins, gems, highest_score, username, current_world")
      .eq("id", userId)
      .maybeSingle();
    if (pErr) throw pErr;

    const newCoins = (profile?.coins ?? 0) + data.coinsEarned;
    const newHigh = Math.max(profile?.highest_score ?? 0, data.score);

    const { error: upErr } = await supabase
      .from("profiles")
      .update({ coins: newCoins, highest_score: newHigh, current_world: data.world })
      .eq("id", userId);
    if (upErr) throw upErr;

    // ----- player_progress -----
    const { data: prog } = await supabase
      .from("player_progress")
      .select("xp, level, total_distance, best_distance, total_runs, total_coins_earned, bosses_defeated")
      .eq("user_id", userId)
      .maybeSingle();

    const xpGain = Math.floor(data.score / 10) + Math.floor(data.distance / 5) + (data.bossDefeated ? 250 : 0);
    const newXp = (prog?.xp ?? 0) + xpGain;
    const newLevel = levelFromXp(newXp);

    await supabase.from("player_progress").upsert({
      user_id: userId,
      xp: newXp,
      level: newLevel,
      total_distance: (prog?.total_distance ?? 0) + data.distance,
      best_distance: Math.max(prog?.best_distance ?? 0, data.distance),
      total_runs: (prog?.total_runs ?? 0) + 1,
      total_coins_earned: (prog?.total_coins_earned ?? 0) + data.coinsEarned,
      bosses_defeated: (prog?.bosses_defeated ?? 0) + (data.bossDefeated ? 1 : 0),
      last_played_at: new Date().toISOString(),
    });

    // ----- leaderboard entry (only when score is a personal best) -----
    if (data.score > (profile?.highest_score ?? 0) && profile?.username) {
      await supabase.from("leaderboards").insert({
        user_id: userId,
        username: profile.username,
        score: data.score,
        distance: data.distance,
        world: data.world,
      });
    }

    // ----- achievement checks -----
    const totals = {
      runs: (prog?.total_runs ?? 0) + 1,
      coins: (prog?.total_coins_earned ?? 0) + data.coinsEarned,
      distance: data.distance,
      bosses: (prog?.bosses_defeated ?? 0) + (data.bossDefeated ? 1 : 0),
      score: data.score,
    };

    const { data: achievements } = await supabase
      .from("achievements")
      .select("key, threshold, metric, reward_coins, reward_gems");

    const { data: unlocked } = await supabase
      .from("user_achievements")
      .select("achievement_key")
      .eq("user_id", userId);
    const unlockedSet = new Set((unlocked ?? []).map((u) => u.achievement_key));

    const newlyUnlocked: string[] = [];
    let bonusCoins = 0;
    let bonusGems = 0;
    for (const a of achievements ?? []) {
      if (unlockedSet.has(a.key)) continue;
      const value = totals[a.metric as keyof typeof totals] ?? 0;
      if (value >= a.threshold) {
        newlyUnlocked.push(a.key);
        bonusCoins += a.reward_coins;
        bonusGems += a.reward_gems;
      }
    }
    if (newlyUnlocked.length > 0) {
      await supabase.from("user_achievements").insert(
        newlyUnlocked.map((k) => ({ user_id: userId, achievement_key: k })),
      );
      if (bonusCoins > 0 || bonusGems > 0) {
        await supabase
          .from("profiles")
          .update({
            coins: newCoins + bonusCoins,
            gems: (profile?.gems ?? 0) + bonusGems,
          })
          .eq("id", userId);
      }
    }

    return {
      coins: newCoins + bonusCoins,
      gems: (profile?.gems ?? 0) + bonusGems,
      highest_score: newHigh,
      xp: newXp,
      level: newLevel,
      xpGained: xpGain,
      unlocked: newlyUnlocked,
    };
  });

export const getPlayerProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [profileRes, progRes, boardsRes, charsRes, achRes, settingsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("player_progress").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("owned_surfboards").select("*").eq("user_id", userId),
      supabase.from("owned_characters").select("*").eq("user_id", userId),
      supabase.from("user_achievements").select("achievement_key, unlocked_at").eq("user_id", userId),
      supabase.from("player_settings").select("*").eq("user_id", userId).maybeSingle(),
    ]);
    return {
      profile: profileRes.data,
      progress: progRes.data,
      surfboards: boardsRes.data ?? [],
      characters: charsRes.data ?? [],
      achievements: achRes.data ?? [],
      settings: settingsRes.data,
    };
  });
