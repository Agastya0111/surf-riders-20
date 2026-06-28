import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Coins, Gem, Trophy, Play, Settings, LogOut, ShoppingBag, BookOpen, Infinity as InfinityIcon, Waves, ChevronRight, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePlayerProgress } from "@/hooks/use-player-progress";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Surf Riders 2.0" }] }),
  component: Dashboard,
});

function xpForLevel(level: number) { return 100 * level; }

function Dashboard() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: progress } = usePlayerProgress(user.id);
  const profile = progress?.profile;
  const prog = progress?.progress;
  const isLoading = !progress;

  const level = prog?.level ?? 1;
  const xp = prog?.xp ?? 0;
  // remaining xp inside current level
  let consumed = 0;
  for (let l = 1; l < level; l++) consumed += xpForLevel(l);
  const xpIntoLevel = xp - consumed;
  const xpNeeded = xpForLevel(level);
  const xpPct = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }


  const initials = (profile?.username || user.email || "S").slice(0, 2).toUpperCase();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-ocean opacity-40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.78_0.16_200/0.2),transparent_60%)]" />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-wave font-display text-lg font-extrabold text-primary-foreground shadow-glow">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-lagoon">Rider · Lv {level}</p>
              <h1 className="truncate font-display text-xl font-extrabold sm:text-2xl">
                {profile?.username ?? "Loading..."}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-secondary/60">
                  <div className="h-full bg-gradient-wave" style={{ width: `${xpPct}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground"><Zap className="inline h-3 w-3 text-sunset" /> {xpIntoLevel}/{xpNeeded} XP</span>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={() => toast.info("Settings coming soon")} className="grid h-11 w-11 place-items-center rounded-full glass transition hover:scale-105" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </button>
            <button onClick={handleSignOut} className="grid h-11 w-11 place-items-center rounded-full glass transition hover:scale-105" aria-label="Sign out">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <StatCard icon={Coins} label="Coins" value={profile?.coins ?? 0} accent="sunset" loading={isLoading} />
          <StatCard icon={Gem} label="Gems" value={profile?.gems ?? 0} accent="lagoon" loading={isLoading} />
          <StatCard icon={Trophy} label="High Score" value={profile?.highest_score ?? 0} accent="coral" loading={isLoading} />
        </section>

        {/* Continue */}
        <section className="mt-6">
          <button onClick={() => navigate({ to: "/play" })} className="group flex w-full items-center justify-between overflow-hidden rounded-3xl bg-gradient-wave p-5 text-left shadow-glow transition hover:scale-[1.01]">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-background/20 backdrop-blur">
                <Play className="h-7 w-7 fill-primary-foreground text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">Continue</p>
                <p className="font-display text-xl font-extrabold text-primary-foreground">
                  Sunny Beach
                </p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-primary-foreground transition group-hover:translate-x-1" />
          </button>
        </section>

        {/* Modes */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <ModeCard icon={BookOpen} title="Story Mode" desc="Restore the Seven Tide Crystals across worlds." cta="Play story" onClick={() => navigate({ to: "/play" })} />
          <ModeCard icon={InfinityIcon} title="Endless Mode" desc="Survive infinite waves. Chase a new high score." cta="Go endless" onClick={() => navigate({ to: "/play" })} />
        </section>

        {/* Tiles */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Tile icon={ShoppingBag} title="Shop" desc="Boards, characters, cosmetics." badge="Soon" />
          <Link to="/leaderboards" className="glass relative rounded-2xl p-5 text-left transition hover:-translate-y-0.5">
            <Trophy className="h-6 w-6 text-lagoon" />
            <p className="mt-3 font-display text-base font-extrabold">Leaderboards</p>
            <p className="mt-1 text-xs text-muted-foreground">Global top riders.</p>
          </Link>
          <Tile icon={Waves} title="Worlds" desc="Travel the seven seas." />
        </section>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Signed in as {user.email} •{" "}
          <Link to="/" className="text-lagoon hover:text-foam">Home</Link>
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent, loading }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent: "sunset" | "lagoon" | "coral"; loading?: boolean }) {
  const ring = accent === "sunset" ? "text-sunset" : accent === "coral" ? "text-coral" : "text-lagoon";
  return (
    <div className="glass rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <Icon className={`h-4 w-4 ${ring}`} />
        <span className="truncate">{label}</span>
      </div>
      <div className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
        {loading ? "—" : value.toLocaleString()}
      </div>
    </div>
  );
}

function ModeCard({ icon: Icon, title, desc, cta, onClick }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; cta: string; onClick?: () => void }) {
  return (
    <button onClick={onClick ?? (() => toast.info(`${title} launches soon.`))} className="group glass flex w-full items-center justify-between rounded-3xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-wave shadow-glow">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold">{title}</p>
          <p className="truncate text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <span className="hidden shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground sm:inline">{cta}</span>
    </button>
  );
}

function Tile({ icon: Icon, title, desc, badge }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; badge?: string }) {
  return (
    <button onClick={() => toast.info(`${title} coming soon.`)} className="glass relative rounded-2xl p-5 text-left transition hover:-translate-y-0.5">
      {badge && <span className="absolute right-3 top-3 rounded-full bg-coral/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral">{badge}</span>}
      <Icon className="h-6 w-6 text-lagoon" />
      <p className="mt-3 font-display text-base font-extrabold">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}

function humanWorld(key: string) {
  return key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
