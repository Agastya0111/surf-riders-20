import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Medal, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/leaderboards")({
  head: () => ({ meta: [{ title: "Leaderboards — Surf Riders 2.0" }] }),
  component: LeaderboardsPage,
});

function LeaderboardsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leaderboards", "global"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leaderboards")
        .select("id, username, score, distance, world, achieved_at")
        .order("score", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-ocean opacity-40" />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-lagoon hover:text-foam">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <header className="mt-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-wave shadow-glow">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-lagoon">Global</p>
            <h1 className="font-display text-3xl font-extrabold">Leaderboards</h1>
          </div>
        </header>

        <div className="mt-8 glass rounded-3xl p-2 shadow-card sm:p-4">
          {isLoading && <p className="p-6 text-center text-sm text-muted-foreground">Loading the wave…</p>}
          {error && <p className="p-6 text-center text-sm text-coral">Could not load leaderboards.</p>}
          {data && data.length === 0 && (
            <p className="p-6 text-center text-sm text-muted-foreground">No scores yet. Be the first.</p>
          )}
          <ol className="divide-y divide-border/40">
            {data?.map((row, i) => (
              <li key={row.id} className="flex items-center gap-4 px-3 py-3 sm:px-4">
                <span className={`grid h-9 w-9 place-items-center rounded-full font-display font-extrabold ${
                  i === 0 ? "bg-sunset/20 text-sunset" : i === 1 ? "bg-foam/20 text-foam" : i === 2 ? "bg-coral/20 text-coral" : "bg-secondary text-muted-foreground"
                }`}>
                  {i < 3 ? <Medal className="h-4 w-4" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{row.username}</p>
                  <p className="text-xs text-muted-foreground">{row.distance}m • {row.world.replace(/_/g, " ")}</p>
                </div>
                <span className="font-display text-lg font-extrabold text-foam">{row.score.toLocaleString()}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
