"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createFriendRequest } from "@/services/friends";
import { AddFriendDialog } from "./AddFriendDialog";

export function FriendPageHeader({
  copied,
  onCopyCode,
}: {
  copied: boolean;
  onCopyCode: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--evven-text-muted)" }}>
          Friends
        </p>
        <h1
          className="mt-2 text-2xl font-medium leading-snug sm:text-[2rem]"
        >
          Friends
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 sm:text-[15px]" style={{ color: "var(--evven-text-muted)" }}>
          Send requests by user code, review pending invites, and open any active friendship to see the full expense trail.
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <Button variant="outline" className="min-w-0 flex-1 justify-center" onClick={onCopyCode}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied code" : "Share my code"}
        </Button>
        <AddFriendDialog onCreate={createFriendRequest} triggerClassName="min-w-0 flex-1" />
      </div>
    </div>
  );
}
