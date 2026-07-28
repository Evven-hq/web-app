"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Copy,
  HandCoins,
  Loader2,
  LogOut,
  ReceiptText,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { getInitials } from "@/components/expenses/friends";
import { updateCurrentUser } from "@/services/users";
import { useAuthStore } from "@/store/auth-store";
import type { User } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AvatarPicker } from "@/components/onboarding/AvatarPicker";

function surfaceCard(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: "var(--evven-card-background)",
    border: "0.5px solid var(--evven-border)",
    ...extra,
  };
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
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const profilePicture = user.profile_picture ?? "";
  const displayName = name || user.name;
  const dirty = name.trim() !== user.name;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setMessage("");
    setError("");
    try {
      const updatedUser = await updateCurrentUser({ name: name.trim() });
      setUser(updatedUser);
      setMessage("Profile updated.");
    } catch {
      setError("Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarConfirm = async (avatarUrl: string) => {
    setAvatarError("");
    setAvatarSaving(true);
    try {
      const updatedUser = await updateCurrentUser({ profile_picture: avatarUrl });
      setUser(updatedUser);
      setAvatarDialogOpen(false);
    } catch {
      setAvatarError("Could not update your avatar.");
    } finally {
      setAvatarSaving(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(user.user_code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Header */}
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
          <p className="mt-2 max-w-xl text-sm leading-6" style={{ color: "var(--evven-text-muted)" }}>
            Manage how you show up to friends and groups on Evven.
          </p>
        </div>

        {/* Hero / identity card */}
        <div
          className="mb-4 overflow-hidden rounded-[30px] p-5 sm:p-7"
          style={{ background: "var(--evven-accent-primary)", color: "var(--evven-text-inverse)" }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setAvatarDialogOpen(true)}
                aria-label="Change avatar"
                className="group relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-(--evven-accent-primary)"
              >
                {profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profilePicture}
                    alt={displayName}
                    className="size-16 rounded-full object-cover ring-2 ring-white/25 transition-opacity group-hover:opacity-80 sm:size-20"
                  />
                ) : (
                  <div
                    className="flex size-16 items-center justify-center rounded-full text-xl font-medium ring-2 ring-white/25 transition-opacity group-hover:opacity-80 sm:size-20"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  >
                    {displayName ? getInitials(displayName) : <UserRound size={26} />}
                  </div>
                )}
                <span
                  className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full text-[10px] font-semibold uppercase tracking-wide opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
                >
                  Change
                </span>
              </button>
              <div className="min-w-0">
                <p className="truncate text-xl font-medium sm:text-2xl">{displayName}</p>
                <p className="mt-0.5 truncate text-sm opacity-80">{user.email}</p>
                <span
                  className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  {user.auth_provider} account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Share account + quick links */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <div className="card rounded-3xl p-5" style={surfaceCard()}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
              Share your account
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--evven-text-muted)" }}>
              Give this code to friends so they can add you to a group.
            </p>
            <button
              onClick={() => void copyCode()}
              className="mt-4 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ background: "var(--evven-surface)" }}
            >
              <span style={{ fontFamily: "var(--font-mono)" }}>{user.user_code}</span>
              {copied ? (
                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--evven-accent-primary)" }}>
                  <Check size={15} />
                  Copied
                </span>
              ) : (
                <Copy size={15} style={{ color: "var(--evven-text-muted)" }} />
              )}
            </button>
          </div>

          <div className="card rounded-3xl p-5" style={surfaceCard()}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
              Quick links
            </p>
            <div className="mt-3 space-y-2">
              <Link
                href="/friends"
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:opacity-80"
                style={{ background: "var(--evven-surface)" }}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--evven-accent-secondary)", color: "var(--evven-accent-primary)" }}
                >
                  <HandCoins size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">Friends</span>
                  <span className="block text-xs" style={{ color: "var(--evven-text-muted)" }}>
                    See who paid what
                  </span>
                </span>
              </Link>
              <Link
                href="/expenses"
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:opacity-80"
                style={{ background: "var(--evven-surface)" }}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "var(--evven-accent-secondary)", color: "var(--evven-accent-primary)" }}
                >
                  <ReceiptText size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">Expenses</span>
                  <span className="block text-xs" style={{ color: "var(--evven-text-muted)" }}>
                    Review your spending
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Edit account */}
        <form onSubmit={handleSubmit} className="card mb-4 rounded-3xl p-5 sm:p-6" style={surfaceCard()}>
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
            Edit account
          </p>

          <div className="mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--evven-text-muted)" }}>
              Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--evven-surface)", border: "0.5px solid var(--evven-border)" }}
              required
            />
          </div>

          {message && <p className="mb-4 text-sm" style={{ color: "var(--evven-accent-primary)" }}>{message}</p>}
          {error && <p className="mb-4 text-sm" style={{ color: "var(--evven-error)" }}>{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving || !name.trim() || !dirty}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50 sm:w-auto"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>

        {/* Danger zone */}
        <div
          className="card rounded-3xl p-5 sm:p-6"
          style={{
            background: "color-mix(in srgb, var(--evven-error) 6%, var(--evven-background))",
            border: "0.5px solid color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "color-mix(in srgb, var(--evven-error) 12%, var(--evven-surface))", color: "var(--evven-error)" }}
              >
                <ShieldAlert size={16} />
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--evven-error)" }}>
                  Danger zone
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--evven-text-muted)" }}>
                  You&apos;re about to sign out of this device.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors sm:w-auto"
              style={{
                border: "0.5px solid color-mix(in srgb, var(--evven-error) 28%, var(--evven-border))",
                background: "color-mix(in srgb, var(--evven-error) 10%, var(--evven-background))",
                color: "var(--evven-error)",
              }}
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>
      </div>

      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent
          className="sm:max-w-md bg-card"
          style={{ backgroundColor: "var(--evven-card-background, white)" }}
        >
          <DialogHeader>
            <DialogTitle>Change avatar</DialogTitle>
            <DialogDescription>
              Pick a new look, or shuffle for more options.
            </DialogDescription>
          </DialogHeader>

          <AvatarPicker
            initialSeed={user.name}
            confirmLabel="Save avatar"
            isSaving={avatarSaving}
            onConfirm={handleAvatarConfirm}
          />

          {avatarError && (
            <p className="mt-3 text-sm" style={{ color: "var(--evven-error)" }}>
              {avatarError}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
