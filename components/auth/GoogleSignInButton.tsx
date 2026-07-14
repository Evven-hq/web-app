"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

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
            }
          ) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton() {
  const router = useRouter();
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const buttonRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [buttonWidth, setButtonWidth] = useState(336);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleInitializedRef = useRef(false);

  useEffect(() => {
    const updateWidth = () => {
      const nextWidth = wrapperRef.current?.clientWidth ?? 336;
      setButtonWidth(Math.max(240, Math.min(400, Math.floor(nextWidth))));
    };

    updateWidth();

    if (!wrapperRef.current || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, []);

  const initializeGoogle = useCallback(() => {
    if (!clientId || !window.google || !buttonRef.current) return;

    if (!googleInitializedRef.current) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setError("");
          try {
            await loginWithGoogle(credential);
            router.push("/dashboard");
          } catch {
            setError("Google sign-in is not available yet.");
          }
        },
      });

      googleInitializedRef.current = true;
    }

    buttonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: buttonWidth,
      text: "continue_with",
    });
  }, [buttonWidth, clientId, loginWithGoogle, router]);

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;
    if (window.google?.accounts?.id) {
      initializeGoogle();
    }
  }, [initializeGoogle, clientId]);

  if (!clientId) {
    return (
      <p className="text-center text-s text-muted-foreground">
        {/* Google sign-in needs `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. */}
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
      {error && <p className="mt-2 text-center text-xs text-destructive">{error}</p>}
    </div>
  );
}
