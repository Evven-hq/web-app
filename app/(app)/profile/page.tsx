"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import { updateCurrentUser } from "@/services/users";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { ChangeAvatarDialog } from "@/components/profile/ChangeAvatarDialog";
import { ProfileDangerZone } from "@/components/profile/ProfileDangerZone";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileIdentityCard } from "@/components/profile/ProfileIdentityCard";
import { ProfileNameForm } from "@/components/profile/ProfileNameForm";
import { ProfileQuickLinks } from "@/components/profile/ProfileQuickLinks";
import { ProfileShareCard } from "@/components/profile/ProfileShareCard";
import { SoundPreferenceCard } from "@/components/profile/SoundPreferenceCard";
import type { User } from "@/types/user";

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
    toast.success("Invite code copied");
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
        <ProfileHeader />

        <ProfileIdentityCard
          profilePicture={profilePicture}
          displayName={displayName}
          email={user.email}
          authProvider={user.auth_provider}
          onOpenAvatar={() => setAvatarDialogOpen(true)}
        />

        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          <ProfileShareCard userCode={user.user_code} copied={copied} onCopy={() => void copyCode()} />
          <ProfileQuickLinks />
        </div>

        <div className="mb-4">
          <ThemeSwitcher />
        </div>

        <div className="mb-4">
          <SoundPreferenceCard />
        </div>

        <ProfileNameForm
          name={name}
          onNameChange={setName}
          dirty={dirty}
          saving={saving}
          message={message}
          error={error}
          onSubmit={handleSubmit}
        />

        <ProfileDangerZone onLogout={handleLogout} />

        <div className="mt-6 text-center text-xs" style={{ color: "var(--evven-text-muted)" }}>
          <a href={`${process.env.NEXT_PUBLIC_LANDING_URL}/privacy`} target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy</a>
          <span className="mx-2">·</span>
          <a href={`${process.env.NEXT_PUBLIC_LANDING_URL}/terms`} target="_blank" rel="noopener noreferrer" className="hover:underline">Terms</a>
        </div>
      </div>

      <ChangeAvatarDialog
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
        initialSeed={user.name}
        isSaving={avatarSaving}
        onConfirm={handleAvatarConfirm}
        error={avatarError}
      />
    </div>
  );
}
