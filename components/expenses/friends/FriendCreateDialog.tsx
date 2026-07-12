"use client";

import { useState } from "react";
import { Loader2, Plus, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Ghost } from "@/types";

interface FriendCreateDialogProps {
  onCreate: (name: string) => Promise<Ghost>;
  onCreated?: (friend: Ghost) => void;
  triggerLabel?: string;
  compact?: boolean;
  title?: string;
  description?: string;
}

function formatFriendName(value: string) {
  const trimmed = value.trimStart();
  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function FriendCreateDialog({
  onCreate,
  onCreated,
  triggerLabel = "Create friend",
  compact = false,
  title = "Create a friend",
  description = "Add a person once and reuse them across personal expenses.",
}: FriendCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setName("");
      setError("");
      setSaving(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextName = formatFriendName(name);
    if (!nextName) return;

    setSaving(true);
    setError("");

    try {
      const friend = await onCreate(nextName);
      onCreated?.(friend);
      setOpen(false);
      setName("");
    } catch {
      setError("Could not create that friend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={compact ? "secondary" : "default"} size={compact ? "sm" : "default"}>
          {compact ? <UserRoundPlus /> : <Plus />}
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm bg-background">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Name
            </label>
            <Input
              value={name}
              onChange={(event) => setName(formatFriendName(event.target.value))}
              placeholder="Rahul, Aanya, Mom..."
              autoFocus
              className="rounded-xl"
            />
          </div>

          {error && <p className="text-sm" style={{ color: "var(--evven-error)" }}>{error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full sm:w-auto"
            >
              {saving && <Loader2 />}
              {saving ? "Creating..." : "Create friend"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
