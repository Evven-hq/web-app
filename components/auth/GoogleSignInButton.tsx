"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { isAxiosError } from "axios";
import { Capacitor } from "@capacitor/core";

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

let gsiInitialized = false;
let nativeGoogleSignInInitialized = false;

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

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
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

  // Google blocks its own Sign-In flow inside any embedded WebView
  // (disallowed_useragent policy, enforced since 2023 — not something we
  // can configure around). Inside the Capacitor native app, we bypass
  // Google's JS SDK entirely and use the native Android/iOS Sign-In SDK
  // via @capawesome/capacitor-google-sign-in instead, which returns the
  // same kind of ID token our backend already expects.
  const isNativeApp = Capacitor.isNativePlatform();

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
    if (isNativeApp) return; 
    if (!clientId || !buttonRef.current) return;
    if (window.google?.accounts?.id) {
      initializeGoogle();
    }
  }, [initializeGoogle, clientId, isNativeApp]);

  const handleNativeSignIn = useCallback(async () => {
    if (!clientId) return;

    setError("");
    setIsSigningIn(true);
    try {
      const { GoogleSignIn } = await import("@capawesome/capacitor-google-sign-in");

      if (!nativeGoogleSignInInitialized) {
        await GoogleSignIn.initialize({ clientId });
        nativeGoogleSignInInitialized = true;
      }

      const result = await GoogleSignIn.signIn();
      await loginWithGoogleRef.current(result.idToken);
      routerRef.current.push("/dashboard");
    } catch (err) {
      setError(getGoogleSignInError(err));
      setIsSigningIn(false);
    }
  }, [clientId]);

  if (!clientId) {
    return (
      <p className="text-center text-s text-muted-foreground">
        Google Sign-Up and Login will be here in future.
      </p>
    );
  }

  if (isNativeApp) {
    return (
      <div ref={wrapperRef} className="w-full">
        <button
          type="button"
          onClick={handleNativeSignIn}
          disabled={isSigningIn}
          className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-border/70 bg-white text-[15px] font-medium text-foreground transition-colors"
          style={
            isSigningIn
              ? {
                  backgroundImage:
                    "linear-gradient(90deg, #fff 0%, #f0ece0 50%, #fff 100%)",
                  backgroundSize: "400px 100%",
                  animation: "google-btn-shimmer 1s linear infinite",
                }
              : undefined
          }
        >
          <GoogleLogo />
          <span>{isSigningIn ? "Signing in..." : "Continue with Google"}</span>
        </button>
        {error && (
          <div className="mt-3 rounded-2xl border border-red-900/30 bg-red-950/20 p-3 text-sm leading-6 text-red-300 animate-in fade-in duration-200">
            {error}
          </div>
        )}
      </div>
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