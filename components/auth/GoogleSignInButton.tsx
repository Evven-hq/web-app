"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { isAxiosError } from "axios";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme: string;
              size: string;
              shape: string;
              width: number;
              text: string;
            },
          ) => void;
        };
      };
    };
  }
}

// Module-level, not component-level: survives unmount/remount across
// client-side navigation (login <-> signup), only resets on a full page reload.
let gsiInitialized = false;

export function GoogleSignInButton() {
  const router = useRouter();
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const buttonRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [buttonWidth, setButtonWidth] = useState(336);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Keep latest router / loginWithGoogle in refs so the GSI callback
  // (captured only once, at first-ever initialize) never goes stale.
  const routerRef = useRef(router);
  const loginWithGoogleRef = useRef(loginWithGoogle);
  useEffect(() => {
    routerRef.current = router;
    loginWithGoogleRef.current = loginWithGoogle;
  }, [router, loginWithGoogle]);

  useEffect(() => {
    const updateWidth = () => {
      const nextWidth = wrapperRef.current?.clientWidth ?? 336;
      const clamped = Math.max(240, Math.min(400, Math.floor(nextWidth)));

      setButtonWidth((prev) => (Math.abs(prev - clamped) < 8 ? prev : clamped));
    };

    updateWidth();

    if (!wrapperRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  const setErrorRef = useRef(setError);
  useEffect(() => {
    setErrorRef.current = setError;
  }, [setError]);

  const initializeGoogle = useCallback(() => {
    if (!clientId || !window.google || !buttonRef.current) return;

    if (!gsiInitialized) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setErrorRef.current(""); // was: setError("")
          try {
            await loginWithGoogleRef.current(credential);
            routerRef.current.push("/dashboard");
          } catch (err) {
            if (isAxiosError(err) && err.response?.data?.detail) {
              setErrorRef.current(err.response.data.detail); // was: setError(...)
            } else {
              setErrorRef.current(
                "Something went wrong with Google sign-in. Please try again.",
              );
            }
          }
        },
      });
      gsiInitialized = true;
    }

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: buttonWidth,
      text: "continue_with",
    });
  }, [buttonWidth, clientId]);

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;
    if (window.google?.accounts?.id) {
      initializeGoogle();
    }
  }, [initializeGoogle, clientId]);

  if (!clientId) {
    return (
      <p className="text-center text-s text-muted-foreground">
        Google Sign-Up and Login will be here in future.
      </p>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogle}
      />
      <div ref={buttonRef} className="flex min-h-11 justify-center" />
      {error && (
        <p className="mt-2 text-center text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}