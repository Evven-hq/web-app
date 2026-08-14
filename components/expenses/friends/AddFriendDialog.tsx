"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, UserRoundPlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { Friend, FriendDetail, FriendRequest } from "@/types";
import { isActiveFriendDetail } from "@/services/friends";
import { getApiErrorMessage } from "@/lib/api-error";

export function AddFriendDialog({
  onCreate,
  triggerClassName,
}: {
  onCreate: (userCode: string) => Promise<Friend | FriendRequest>;
  triggerClassName?: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: onCreate,
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["friends"] }),
        queryClient.invalidateQueries({ queryKey: ["friend-requests"] }),
      ]);

      if (isActiveFriendDetail(result as FriendDetail)) {
        router.push(`/friends?friend_id=${result.id}`);
        setSuccess("");
      } else if ("status" in result && String(result.status ?? "").toUpperCase() === "ACTIVE") {
        router.push(`/friends?friend_id=${result.id}`);
      } else {
        setSuccess("Request sent. They’ll appear here once they accept.");
      }

      setUserCode("");
      setError("");
    },
    onError: (err) => {
      setError(getApiErrorMessage(err, "Could not send that friend request."));
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setUserCode("");
          setError("");
          setSuccess("");
          mutation.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <UserRoundPlus />
          Add friend
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: "var(--evven-card-background)",
          borderColor: "var(--evven-border)",
          boxShadow: "0 24px 80px rgba(26, 24, 22, 0.14)",
        }}
      >
        <DialogHeader>
          <DialogTitle>Add a friend</DialogTitle>
          <DialogDescription>
            Enter their user code. If they already have you pending, the relationship activates immediately.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4 rounded-[24px] border bg-[var(--evven-background)] p-4 sm:p-5"
          style={{ borderColor: "var(--evven-border)" }}
          onSubmit={(event) => {
            event.preventDefault();
            const next = userCode.trim().toUpperCase();
            if (!next) {
              setError("Enter a user code.");
              return;
            }
            mutation.mutate(next);
          }}
        >
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              User code
            </label>
            <input
              autoFocus
              value={userCode}
              onChange={(event) => setUserCode(event.target.value.toUpperCase())}
              placeholder="E.g. EVV-4821"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
              style={{
                background: "var(--evven-background)",
                borderColor: "var(--evven-border)",
              }}
            />
          </div>

          {success ? (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                background: "color-mix(in srgb, var(--evven-accent-secondary) 18%, var(--evven-background))",
                borderColor: "color-mix(in srgb, var(--evven-accent-primary) 20%, var(--evven-border))",
              }}
            >
              {success}
            </div>
          ) : null}

          {error ? (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                background: "color-mix(in srgb, var(--evven-error) 8%, var(--evven-background))",
                borderColor: "color-mix(in srgb, var(--evven-error) 24%, var(--evven-border))",
                color: "var(--evven-error)",
              }}
            >
              {error}
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
              {mutation.isPending ? "Sending..." : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
