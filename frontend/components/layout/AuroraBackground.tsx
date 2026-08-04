/**
 * Decorative, GPU-cheap floating aurora blobs.
 * Purely presentational (aria-hidden) — animation is CSS transform/opacity
 * only and is disabled globally under prefers-reduced-motion (globals.css).
 */
export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-background" />
      <div
        className="aurora-blob left-[-10%] top-[-10%] h-[42vw] w-[42vw] animate-aurora-float bg-primary/30"
      />
      <div
        className="aurora-blob right-[-15%] top-[10%] h-[38vw] w-[38vw] animate-aurora-float-slow bg-secondary/30"
      />
      <div
        className="aurora-blob bottom-[-20%] left-[20%] h-[46vw] w-[46vw] animate-aurora-float bg-accent-cyan/20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
    </div>
  );
}
