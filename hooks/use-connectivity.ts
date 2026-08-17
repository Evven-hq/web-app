"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const HEALTH_PATH = "/health";
const HEALTH_CHECK_INTERVAL_MS = 20000;
const HEALTH_CHECK_TIMEOUT_MS = 4000;

function getHealthUrl() {
  return new URL(HEALTH_PATH, API_URL).toString();
}

async function checkBackendReachability() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => {
    controller.abort();
  }, HEALTH_CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(getHealthUrl(), {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function useConnectivity() {
  const [browserOnline, setBrowserOnline] = useState(true);
  const [backendReachable, setBackendReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const updateBrowserState = () => {
      setBrowserOnline(window.navigator.onLine);
    };

    updateBrowserState();
    window.addEventListener("online", updateBrowserState);
    window.addEventListener("offline", updateBrowserState);

    return () => {
      window.removeEventListener("online", updateBrowserState);
      window.removeEventListener("offline", updateBrowserState);
    };
  }, []);

  useEffect(() => {
    if (!browserOnline) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBackendReachable(false);
      return;
    }

    let active = true;
    setBackendReachable(null);

    const runCheck = async () => {
      const reachable = await checkBackendReachability();
      if (active) {
        setBackendReachable(reachable);
      }
    };

    void runCheck();

    const interval = window.setInterval(() => {
      void runCheck();
    }, HEALTH_CHECK_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [browserOnline]);

  const isOnline = useMemo(() => {
    if (!browserOnline) return false;
    if (backendReachable === false) return false;
    return true;
  }, [backendReachable, browserOnline]);

  const isChecking = browserOnline && backendReachable === null;

  return {
    browserOnline,
    backendReachable,
    isOnline,
    isChecking,
  };
}
