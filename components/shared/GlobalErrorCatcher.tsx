"use client";

import { useEffect } from "react";
import { reportError } from "@/lib/error-log";

let mounted = false;

export function GlobalErrorCatcher() {
  useEffect(() => {
    if (mounted) return;
    mounted = true;

    function onError(event: ErrorEvent) {
      if (event.error) {
        reportError(event.error);
      }
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      if (event.reason instanceof Error) {
        reportError(event.reason);
      } else {
        reportError(new Error(String(event.reason)));
      }
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
