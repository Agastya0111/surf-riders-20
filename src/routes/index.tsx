import { createFileRoute, Link } from "@tanstack/react-router";
import { Waves, Trophy, Sparkles, Gamepad2, Globe2, ShieldCheck, Play, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-wave.jpg";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Surf Riders 2.0 — The Premium Mobile Surfing Adventure" },
      { name: "description", content: "Carve legendary waves across mythic ocean worlds. Sign up, customize your surfer, climb the leaderboard. Free to play on mobile." },
      { property: "og:title", content: "Surf Riders 2.0" },
      { property: "og:description", content: "The premium mobile surfing adventure. Catch the wave." },
      { property: "og:image", content: "/og-cover.jpg" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Globe2, title: "5 Ocean Worlds", desc: "From the Tropical Lagoon to the Arctic Surge, each world has its own waves, hazards, and unlockables." },
  { icon: Gamepad2, title: "Story + Endless Modes", desc: "Follow Kai's journey across the seven seas — or rack up combos forever in Endless Mode." },
  { icon: Sparkles, title: "Boards & Characters", desc: "Collect dozens of surfboards and riders. Equip them, customize them, ride them into history." },
  { icon: Trophy, title: "Global Leaderboards", desc: "Compete with riders worldwide. Daily, weekly, and all-time wave-score rankings." },
  { icon: ShieldCheck, title: "Cloud Save", desc: "Your coins, gems, score, and gear sync to your account. Pick up where you left off, anywhere." },
  { icon: Waves, title: "Built for Touch", desc: "Premium one-thumb controls with haptics. Designed mobile-first, optimized for every screen." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Surfer riding a giant glowing wave at sunset" className="h-full w-full object-cover opacity-40" width={1920} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-coral animate-wave-pulse" />
            New season • Tropical Lagoon now open
          </div>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl">
            <span className="block">Catch the</span>
            <span className="block text-gradient-sunset">endless wave.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Surf Riders 2.0 is the premium mobile surfing adventure. Carve mythic waves, unlock legendary boards, and ride into history.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/auth" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-wave px-8 py-4 text-base font-semibold text-primary-foreground shadow-glow transition hover:scale-105 sm:w-auto">
              <Play className="h-5 w-5 fill-current" />
              Play Now — Free
            </Link>
            <a href="#story" className="inline-flex w-full items-center justify-center gap-2 rounded-full glass px-8 py-4 text-base font-semibold text-foreground transition hover:scale-105 sm:w-auto">
              The Story
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <Stat label="Active riders" value="120K+" />
            <Dot />
            <Stat label="Waves caught" value="9.4M" />
            <Dot />
            <Stat label="App rating" value="4.9★" />
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-lagoon">The Story</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
                A surfer. A storm. <span className="text-gradient-wave">A legend reborn.</span>
              </h2>
              <p className="mt-6 text-muted-foreground">
                Long ago, the seven seas were guarded by riders who could speak with the waves. When the great storm shattered the Coral Crown, the riders vanished — and the oceans went silent.
              </p>
              <p className="mt-4 text-muted-foreground">
                You are Kai, the last apprentice. Travel across forgotten worlds, master ancient boards, and restore the Crown one wave at a time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge>5 Worlds</Badge>
                <Badge>40+ Levels</Badge>
                <Badge>12 Boss Waves</Badge>
              </div>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-ocean shadow-card">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(0.78_0.16_200/0.3),transparent_60%)]" />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-lagoon">Chapter I</div>
                  <div className="mt-1 font-display text-2xl font-extrabold">The Tropical Lagoon</div>
                  <p className="mt-2 text-sm text-muted-foreground">Learn the basics. Catch your first wave. Meet the Tide Master.</p>
                </div>
              </div>
              <Waves className="absolute -bottom-10 -right-10 h-64 w-64 text-lagoon/20 animate-float-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-lagoon">Features</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">
              Everything you need to <span className="text-gradient-sunset">ride forever.</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group glass rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-glow">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-wave shadow-glow">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLDS strip */}
      <section id="worlds" className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="glass overflow-hidden rounded-3xl bg-gradient-ocean p-8 shadow-card sm:p-14">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Ready to paddle out?</h2>
                <p className="mt-4 text-muted-foreground">
                  Create your free account. Claim your starter board. Catch your first legendary wave in under a minute.
                </p>
                <Link to="/auth" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-wave px-8 py-4 text-base font-semibold text-primary-foreground shadow-glow transition hover:scale-105">
                  <Play className="h-5 w-5 fill-current" />
                  Start Riding Free
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Tropical Lagoon", "Coral Reef", "Storm Coast", "Arctic Surge", "Volcano Pipe", "The Crown"].map((w, i) => (
                  <div key={w} className="glass rounded-2xl p-4">
                    <div className="text-xs font-semibold uppercase tracking-widest text-lagoon">World {i + 1}</div>
                    <div className="mt-1 font-display text-base font-bold">{w}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-lg font-extrabold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}
function Dot() { return <span className="h-1 w-1 rounded-full bg-border" />; }
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">{children}</span>;
}
