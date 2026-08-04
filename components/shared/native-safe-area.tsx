"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Enables @capacitor-community/safe-area so it injects --safe-area-inset-top
 * / -bottom / -left / -right CSS variables into the document. Without this,
 * those variables are never set and any fixed-position UI (the top avatar
 * chip, the add-expense button, the bottom dock) ends up padded by a flat
 * guess instead of the device's actual status bar / gesture bar height.
 *
 * Native app only — web and iOS already get correct env(safe-area-inset-*)
 * values for free; this plugin exists specifically to patch Android's
 * edge-to-edge WebView, which doesn't report them correctly on its own.
 */
export default function NativeSafeArea() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    import("@capacitor-community/safe-area").then(({ SafeArea }) => {
      SafeArea.enable({
        config: {
          customColorsForSystemBars: true,
          statusBarColor: "#00000000",
          statusBarContent: "dark",
          navigationBarColor: "#00000000",
          navigationBarContent: "dark",
        },
      });
    });
  }, []);

  return null;
}