export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        className="flex size-10 items-center justify-center rounded-full"
        style={{ background: "var(--evven-surface)" }}
      >
        <span
          className="inline-block size-5 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "var(--evven-accent-primary)", borderTopColor: "transparent" }}
        />
      </div>
    </div>
  );
}
