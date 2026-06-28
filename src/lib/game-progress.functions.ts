import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SaveSchema = z.object({
  score: z.number().int().min(0).max(10_000_000),
  coinsEarned: z.number().int().min(0).max(1_000_000),
  distance: z.number().int().min(0).max(10_000_000),
  bossDefeated: z.boolean().optional().default(false),
});

export const saveGameRun = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => SaveSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile, error: fetchErr } = await supabase
      .from("profiles")
      .select("coins, highest_score")
      .eq("id", userId)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    const newCoins = (profile?.coins ?? 0) + data.coinsEarned;
    const newHigh = Math.max(profile?.highest_score ?? 0, data.score);
    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        coins: newCoins,
        highest_score: newHigh,
      })
      .eq("id", userId);
    if (upErr) throw upErr;
    return { coins: newCoins, highest_score: newHigh };
  });
