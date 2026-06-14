"use client";

import { useState } from "react";
import { Check, Copy, Loader2, UserRound } from "lucide-react";
import { updateCurrentUser } from "@/services/users";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types/user";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  if (!user) return null;

  return <ProfileEditor key={user.id} user={user} setUser={setUser} />;
}

function ProfileEditor({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User) => void;
}) {
  const [name, setName] = useState(user.name);
  const [profilePicture, setProfilePicture] = useState(user.profile_picture ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const displayName = name || user.name;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const updatedUser = await updateCurrentUser({
        name: name.trim(),
        profile_picture: profilePicture.trim() || null,
      });
      setUser(updatedUser);
      setMessage("Profile updated.");
    } catch {
      setError("Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(user.user_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Account
          </p>
          <h1 className="text-2xl font-medium">Profile</h1>
        </div>

        <div
          className="mb-4 flex items-center gap-4 rounded-2xl border bg-white p-5"
          style={{ borderColor: "var(--evven-border)" }}
        >
          {profilePicture ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profilePicture}
              alt={displayName}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-primary">
              {displayName ? getInitials(displayName) : <UserRound size={22} />}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{displayName}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 text-xs capitalize text-muted-foreground">
              {user.auth_provider} account
            </p>
          </div>
        </div>

        <div
          className="mb-4 rounded-2xl border bg-white p-5"
          style={{ borderColor: "var(--evven-border)" }}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Your user code
          </p>
          <p className="mb-3 text-sm text-muted-foreground">
            Share this code when someone wants to add you to a group.
          </p>
          <button
            onClick={() => void copyCode()}
            className="flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-3 text-sm font-semibold"
          >
            <span>{user.user_code}</span>
            {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border bg-white p-5 sm:p-6"
          style={{ borderColor: "var(--evven-border)" }}
        >
          <h2 className="mb-5 text-sm font-medium">Edit profile</h2>
          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border bg-secondary px-4 py-2.5 text-sm"
              style={{ borderColor: "var(--evven-border)" }}
              required
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Profile picture URL
            </label>
            <input
              value={profilePicture}
              onChange={(event) => setProfilePicture(event.target.value)}
              type="url"
              placeholder="https://..."
              className="w-full rounded-xl border bg-secondary px-4 py-2.5 text-sm"
              style={{ borderColor: "var(--evven-border)" }}
            />
          </div>

          {message && <p className="mb-4 text-sm text-primary">{message}</p>}
          {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
