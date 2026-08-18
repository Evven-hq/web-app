"use client";

export function ProfileHeader() {
  return (
    <div className="mb-6">
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Account
      </p>
      <h1 className="mt-2 text-2xl font-medium leading-snug sm:text-[2rem]">
        Your Profile
      </h1>
      <p
        className="mt-2 max-w-xl text-sm leading-6"
        style={{ color: "var(--evven-text-muted)" }}
      >
        Manage how you show up to friends and groups on Evven.
      </p>
    </div>
  );
}
