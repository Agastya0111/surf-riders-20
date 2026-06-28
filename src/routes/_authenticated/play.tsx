import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Pause, Play, RotateCcw, Home, Coins, Trophy, Zap, Heart, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Sparkles,
} from "lucide-react";
import { SurfGame, type GameState } from "@/game/engine";
import { saveGameRun } from "@/lib/game-progress.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/play")({
  head: () => ({ meta: [{ title: "Sunny Beach — Surf Riders 2.0" }] }),
  component: PlayPage,
});

const CUTSCENE = [
  "Long ago, the Seven Tide Crystals kept the oceans calm…",
  "Until the Pirate King stole them, summoning storms and sea monsters.",
  "The Ocean Guardian has chosen YOU to recover the crystals.",
  "Your journey begins on Sunny Beach. Ride the wave, hero.",
];

function PlayPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();
  const save = useServerFn(saveGameRun);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<SurfGame | null>(null);

  const [phase, setPhase] = useState<"loading" | "cutscene" | "playing">("loading");
  const [cutIdx, setCutIdx] = useState(0);
  const [state, setState] = useState<GameState | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<{ coins: number; highest_score: number } | null>(null);

  // Loading screen
  useEffect(() => {
    const t = setTimeout(() => setPhase("cutscene"), 900);
    return () => clearTimeout(t);
  }, []);

  // Cutscene auto-advance
  useEffect(() => {
    if (phase !== "cutscene") return;
    const t = setTimeout(() => {
      if (cutIdx < CUTSCENE.length - 1) setCutIdx((i) => i + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [phase, cutIdx]);

  const startGame = useCallback(() => {
    setPhase("playing");
  }, []);

  // Initialize game once canvas is mounted
  useEffect(() => {
    if (phase !== "playing" || !canvasRef.current) return;
    const game = new SurfGame(canvasRef.current, {
      onStateChange: (s) => setState(s),
      onGameOver: async (r) => {
        setSaving(true);
        try {
          const res = await save({ data: { score: r.score, coinsEarned: r.coins, distance: r.distance, bossDefeated: r.bossDefeated } });
          setSaved(res);
          queryClient.invalidateQueries({ queryKey: ["player-progress", user.id] });
        } catch (e) {
          console.error(e);
          toast.error("Could not save run. Progress kept locally.");
        } finally {
          setSaving(false);
        }
      },
    });
    gameRef.current = game;
    game.start();
    setState({ ...game.state });
    return () => game.destroy();
  }, [phase, save, queryClient, user.id]);

  const onPause = () => gameRef.current?.pause();
  const onResume = () => gameRef.current?.resume();
  const onRestart = () => {
    setSaved(null);
    gameRef.current?.restart();
  };
  const onHome = async () => {
    gameRef.current?.destroy();
    await navigate({ to: "/dashboard" });
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-background select-none">
      {/* Loading */}
      {phase === "loading" && <LoadingScreen />}

      {/* Cutscene */}
      {phase === "cutscene" && (
        <Cutscene
          line={CUTSCENE[cutIdx]}
          index={cutIdx}
          total={CUTSCENE.length}
          onNext={() => (cutIdx < CUTSCENE.length - 1 ? setCutIdx(cutIdx + 1) : startGame())}
          onSkip={startGame}
        />
      )}

      {/* Game */}
      {phase === "playing" && (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none"
            style={{ touchAction: "none" }}
            aria-label="Surf Riders gameplay"
          />

          {/* HUD */}
          {state && state.status !== "gameover" && (
            <Hud state={state} onPause={onPause} />
          )}

          {/* Pause */}
          {state?.status === "paused" && (
            <Overlay title="Paused" subtitle="Catch your breath, rider.">
              <OverlayButton onClick={onResume} icon={Play}>Resume</OverlayButton>
              <OverlayButton onClick={onRestart} icon={RotateCcw} variant="ghost">Restart</OverlayButton>
              <OverlayButton onClick={onHome} icon={Home} variant="ghost">Exit</OverlayButton>
            </Overlay>
          )}

          {/* Game over */}
          {state?.status === "gameover" && (
            <Overlay title="Wipeout" subtitle={state.bossDefeated ? "Crystal recovered!" : "The wave got you."}>
              <div className="mb-4 grid grid-cols-3 gap-3 text-center">
                <Stat label="Score" value={state.score.toLocaleString()} icon={Trophy} />
                <Stat label="Coins" value={`+${state.coins}`} icon={Coins} />
                <Stat label="Distance" value={`${state.distance}m`} icon={Zap} />
              </div>
              {saving && <p className="mb-3 text-xs text-muted-foreground">Saving progress…</p>}
              {saved && (
                <p className="mb-3 text-xs text-lagoon">
                  High score: {saved.highest_score.toLocaleString()} • Total coins: {saved.coins.toLocaleString()}
                </p>
              )}
              <OverlayButton onClick={onRestart} icon={RotateCcw}>Play again</OverlayButton>
              <OverlayButton onClick={onHome} icon={Home} variant="ghost">Dashboard</OverlayButton>
            </Overlay>
          )}

          {/* Touch hint (first run) */}
          {state?.status === "playing" && state.distance < 40 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center sm:bottom-16">
              <div className="rounded-full bg-background/70 px-4 py-2 text-xs text-foreground backdrop-blur animate-pulse">
                Swipe to move • Tap twice to dash
              </div>
            </div>
          )}

          {/* Mobile controls (visible on touch) */}
          {state?.status === "playing" && (
            <MobileControls
              onLeft={() => dispatchKey("ArrowLeft")}
              onRight={() => dispatchKey("ArrowRight")}
              onJump={() => dispatchKey(" ")}
              onSlide={() => dispatchKey("ArrowDown")}
              onDash={() => dispatchKey("Shift")}
            />
          )}
        </>
      )}
    </div>
  );
}

function dispatchKey(key: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key }));
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-ocean">
      <div className="text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-wave shadow-glow animate-wave-pulse">
          <Sparkles className="h-10 w-10 text-primary-foreground" />
        </div>
        <p className="font-display text-2xl font-extrabold text-foam">Paddling out…</p>
        <p className="mt-2 text-sm text-muted-foreground">Loading Sunny Beach</p>
      </div>
    </div>
  );
}

function Cutscene({ line, index, total, onNext, onSkip }: { line: string; index: number; total: number; onNext: () => void; onSkip: () => void }) {
  return (
    <button onClick={onNext} className="absolute inset-0 grid cursor-pointer place-items-center bg-gradient-ocean text-left">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="absolute right-4 top-4">
        <span onClick={(e) => { e.stopPropagation(); onSkip(); }} className="rounded-full bg-background/40 px-4 py-2 text-xs font-semibold text-foam backdrop-blur hover:bg-background/60">
          Skip ▸
        </span>
      </div>
      <div className="max-w-xl px-6">
        <p key={index} className="font-display text-2xl font-extrabold leading-snug text-foam animate-fade-in sm:text-4xl">
          {line}
        </p>
        <div className="mt-8 flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? "w-10 bg-lagoon" : "w-4 bg-foam/30"}`} />
          ))}
        </div>
        <p className="mt-6 text-xs text-foam/70">Tap to continue</p>
      </div>
    </button>
  );
}

function Hud({ state, onPause }: { state: GameState; onPause: () => void }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3 sm:p-4">
      <div className="mx-auto flex max-w-4xl items-start justify-between gap-3">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <Pill icon={Trophy} label={state.score.toLocaleString()} color="text-sunset" />
          <Pill icon={Coins} label={String(state.coins)} color="text-sunset" />
          <Pill icon={Zap} label={`${state.distance}m`} color="text-lagoon" />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <Hearts count={state.health} />
          <button onClick={onPause} aria-label="Pause" className="grid h-10 w-10 place-items-center rounded-full bg-background/70 backdrop-blur transition hover:scale-105">
            <Pause className="h-5 w-5" />
          </button>
        </div>
      </div>

      {state.combo >= 2 && (
        <div className="pointer-events-none mx-auto mt-3 flex max-w-4xl justify-center">
          <div className="rounded-full bg-coral/90 px-4 py-1.5 text-sm font-bold text-foam shadow-glow">
            COMBO ×{state.combo} {state.multiplier > 1 && <span className="ml-2 opacity-80">({state.multiplier.toFixed(1)}× mult)</span>}
          </div>
        </div>
      )}

      {state.bossActive && (
        <div className="pointer-events-none mx-auto mt-3 flex max-w-md justify-center">
          <div className="w-full rounded-full bg-background/70 p-2 backdrop-blur">
            <p className="mb-1 text-center text-xs font-bold uppercase tracking-widest text-coral">Giant Crab</p>
            <div className="h-2 overflow-hidden rounded-full bg-background">
              <div className="h-full bg-gradient-sunset transition-all" style={{ width: `${(state.bossHealth / 6) * 100}%` }} />
            </div>
            <p className="mt-1 text-center text-[10px] text-muted-foreground">Dash into it!</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Pill({ icon: Icon, label, color }: { icon: React.ComponentType<{ className?: string }>; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1.5 backdrop-blur">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-sm font-bold tabular-nums">{label}</span>
    </div>
  );
}

function Hearts({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-background/70 px-3 py-1.5 backdrop-blur">
      {Array.from({ length: 3 }).map((_, i) => (
        <Heart key={i} className={`h-4 w-4 ${i < count ? "fill-coral text-coral" : "text-muted-foreground"}`} />
      ))}
    </div>
  );
}

function Overlay({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-background/70 backdrop-blur-md animate-fade-in">
      <div className="glass mx-4 w-full max-w-sm rounded-3xl p-6 shadow-card animate-scale-in">
        <h2 className="text-center font-display text-3xl font-extrabold text-gradient-wave">{title}</h2>
        {subtitle && <p className="mt-1 text-center text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-5 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}

function OverlayButton({ onClick, icon: Icon, variant = "primary", children }: { onClick: () => void; icon: React.ComponentType<{ className?: string }>; variant?: "primary" | "ghost"; children: React.ReactNode }) {
  const cls =
    variant === "primary"
      ? "bg-gradient-wave text-primary-foreground shadow-glow hover:scale-[1.02]"
      : "bg-secondary text-foreground hover:bg-secondary/80";
  return (
    <button onClick={onClick} className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition ${cls}`}>
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="rounded-2xl bg-background/40 p-3">
      <Icon className="mx-auto h-4 w-4 text-lagoon" />
      <p className="mt-1 font-display text-lg font-extrabold">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function MobileControls({ onLeft, onRight, onJump, onSlide, onDash }: { onLeft: () => void; onRight: () => void; onJump: () => void; onSlide: () => void; onDash: () => void }) {
  // Hidden on desktop (sm+), shown as soft on-screen pad on mobile as a fallback
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 grid grid-cols-3 gap-2 p-3 sm:hidden">
      <div className="pointer-events-auto flex items-end gap-2">
        <CtrlBtn onClick={onLeft} aria="Move left"><ArrowLeft className="h-5 w-5" /></CtrlBtn>
        <CtrlBtn onClick={onRight} aria="Move right"><ArrowRight className="h-5 w-5" /></CtrlBtn>
      </div>
      <div className="pointer-events-auto flex items-end justify-center">
        <CtrlBtn onClick={onDash} aria="Dash" wide>
          <Zap className="h-5 w-5" /> Dash
        </CtrlBtn>
      </div>
      <div className="pointer-events-auto flex items-end justify-end gap-2">
        <CtrlBtn onClick={onSlide} aria="Slide"><ArrowDown className="h-5 w-5" /></CtrlBtn>
        <CtrlBtn onClick={onJump} aria="Jump"><ArrowUp className="h-5 w-5" /></CtrlBtn>
      </div>
    </div>
  );
}

function CtrlBtn({ onClick, aria, wide, children }: { onClick: () => void; aria: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <button
      aria-label={aria}
      onTouchStart={(e) => { e.preventDefault(); onClick(); }}
      onClick={onClick}
      className={`flex h-12 ${wide ? "px-4" : "w-12"} items-center justify-center gap-1.5 rounded-full bg-background/70 text-sm font-bold text-foam backdrop-blur active:scale-95`}
    >
      {children}
    </button>
  );
}
