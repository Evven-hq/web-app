"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <div className="max-w-sm text-center">
        <h1 className="mb-2 text-xl font-semibold">
          Something went wrong
        </h1>

        <p className="mb-6 text-sm text-muted-foreground">
          We couldn&apos;t open Evven.
        </p>

        <button
          onClick={reset}
          className="rounded-xl bg-primary px-5 py-2.5 text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}