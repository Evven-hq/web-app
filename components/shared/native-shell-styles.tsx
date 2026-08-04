"use client";

import { useEffect } from "react";
import { isDesktop } from "@/lib/desktop";

export default function NativeShellStyles() {
  useEffect(() => {
    if (isDesktop()) {
      document.documentElement.classList.add("native-shell");
    }
  }, []);

  return null;
}