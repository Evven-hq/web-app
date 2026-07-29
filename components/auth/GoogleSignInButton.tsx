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

function getGoogleSignInError(err: unknown) {
  if (!isAxiosError(err)) {
    return err instanceof Error
      ? err.message
      : "Something went wrong with Google sign-in. Please try again.";
  }

  const detail = err.response?.data?.detail;
  const message = err.response?.data?.message;
  const status = err.response?.status;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const firstMessage = detail.find(
      (item): item is { msg: string } =>
        typeof item === "object" &&
        item !== null &&
        "msg" in item &&
        typeof item.msg === "string",
    );

    if (firstMessage) {
      return firstMessage.msg;
    }
  }

  if (typeof message === "string") {
    return message;
  }

  if (status === 409 || status === 400) {
    return "An account with this email already uses a password. Log in with your email and password instead.";
  }

  return "Something went wrong with Google sign-in. Please try again.";
}

export function GoogleSignInButton() {
  const router = useRouter();
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const buttonRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
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
  const setIsSigningInRef = useRef(setIsSigningIn);
  useEffect(() => {
    setErrorRef.current = setError;
    setIsSigningInRef.current = setIsSigningIn;
  }, [setError, setIsSigningIn]);

  const initializeGoogle = useCallback(() => {
    if (!clientId || !window.google || !buttonRef.current) return;

    if (!gsiInitialized) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setErrorRef.current("");
          setIsSigningInRef.current(true);
          try {
            await loginWithGoogleRef.current(credential);
            routerRef.current.push("/dashboard");
          } catch (err) {
            setErrorRef.current(getGoogleSignInError(err));
            setIsSigningInRef.current(false);
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
      <div className="relative min-h-11">
        <div
          ref={buttonRef}
          className={isSigningIn ? "flex min-h-11 justify-center opacity-0" : "flex min-h-11 justify-center"}
          aria-hidden={isSigningIn}
        />
        {isSigningIn && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 flex min-h-11 items-center justify-center rounded-full border border-border/70 bg-background/80 px-4 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm"
          >
            <span className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            Signing in with Google...
          </div>
        )}
      </div>
      {error && (
        <div className="mt-3 rounded-2xl border border-red-900/30 bg-red-950/20 p-3 text-sm leading-6 text-red-300 animate-in fade-in duration-200">
          {error}
        </div>
      )}
    </div>
  );
}
