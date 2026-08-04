"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Loads @capacitor-community/safe-area on native builds so its Android
 * edge-to-edge safe-area handling is registered, then applies readable system
 * bar content styling. The plugin handles safe areas natively in v8; CSS
 * should continue using env(safe-area-inset-*) with local fallbacks.
 *
 * Native app only. Web and iOS already get correct env(safe-area-inset-*)
 * values for free; this plugin exists specifically to patch Android
 * edge-to-edge WebViews that don't report them correctly on their own.
 */
export default function NativeSafeArea() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    import("@capacitor-community/safe-area").then(({ SafeArea, SystemBarsStyle }) => {
      void SafeArea.setSystemBarsStyle({
        style: SystemBarsStyle.Light,
      });
    });
  }, []);

  return null;
}
