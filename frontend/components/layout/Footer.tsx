/** Redesigned footer shown on every page of the application (FR-011). */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-1 px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-muted">Todo App © All Rights Reserved 2026</p>
      </div>
    </footer>
  );
}
