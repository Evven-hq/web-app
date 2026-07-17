"use client";

import React, { useEffect, useRef, useState } from "react";

type PixelShadowCanvasProps = {
  pixelSize?: number;
  radius?: number;
  fade?: number;
  maxOpacity?: number;
  className?: string;
  /**
   * Radius (in grid cells) of the ambient mobile blob.
   * Defaults to a softer, larger radius than the desktop cursor trail.
   */
  blobRadius?: number;
};

/**
 * use as the first child inside a `position: relative` and
 * `overflow: hidden` container (e.g. the hero card). It is
 * pointer-events: none on the canvas itself, so it never blocks
 * clicks on content rendered after it in the DOM.
 *
 * Desktop (fine pointer): mouse-move paints a fading pixel trail.
 * Mobile (coarse pointer): a soft glowing blob drifts with the
 * phone's tilt (gyro/deviceorientation), with a gentle idle float
 * layered in and finger-drag as a fallback/extra input.
 */
export default function PixelShadowCanvas({
  pixelSize = 10,
  radius = 4.2,
  fade = 0.05,
  maxOpacity = 0.3,
  className = "",
  blobRadius,
}: PixelShadowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [needsMotionPermission, setNeedsMotionPermission] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isCoarsePointer =
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(pointer: coarse)").matches;

    let cols = 0;
    let rows = 0;
    let grid = new Float32Array(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = host.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.ceil(rect.width / pixelSize));
      rows = Math.max(1, Math.ceil(rect.height / pixelSize));
      grid = new Float32Array(cols * rows);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // ---------------------------------------------------------------
    // Desktop: mouse-driven fading trail (unchanged original behavior)
    // ---------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const cx = Math.floor(mouseX / pixelSize);
      const cy = Math.floor(mouseY / pixelSize);
      const rad = Math.ceil(radius);

      for (let dx = -rad; dx <= rad; dx++) {
        for (let dy = -rad; dy <= rad; dy++) {
          const dist = Math.hypot(dx, dy);
          if (dist > radius) continue;
          const x = cx + dx;
          const y = cy + dy;
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const strength = 1 - dist / radius;
          const idx = y * cols + x;
          grid[idx] = Math.max(grid[idx], strength);
        }
      }
    };

    // ---------------------------------------------------------------
    // Mobile: gyro-driven blob + idle float + touch-drag fallback
    // ---------------------------------------------------------------
    const blobRad = blobRadius ?? radius * 2.4;

    // Target position is normalized 0..1 within the host; smoothed
    // toward with `curNX/curNY` each frame for a soft, springy feel.
    let targetNX = 0.5;
    let targetNY = 0.5;
    let curNX = 0.5;
    let curNY = 0.5;
    let baseBeta: number | null = null;
    let baseGamma: number | null = null;
    let driftT = Math.random() * 10;
    let usingTouch = false;
    let touchReleaseTimer: ReturnType<typeof setTimeout> | null = null;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (usingTouch) return; // finger input takes priority while active
      const beta = e.beta; // front-back tilt, -180..180
      const gamma = e.gamma; // left-right tilt, -90..90
      if (beta == null || gamma == null) return;

      if (baseBeta == null) {
        baseBeta = beta;
        baseGamma = gamma;
      }

      const dBeta = beta - (baseBeta ?? 0);
      const dGamma = gamma - (baseGamma ?? 0);

      // ~40deg of tilt sweeps the blob from center to edge.
      const sensitivity = 1 / 40;
      targetNX = 0.5 + Math.max(-0.5, Math.min(0.5, dGamma * sensitivity));
      targetNY = 0.5 + Math.max(-0.5, Math.min(0.5, dBeta * sensitivity));
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      usingTouch = true;
      if (touchReleaseTimer) clearTimeout(touchReleaseTimer);
      const rect = host.getBoundingClientRect();
      targetNX = Math.max(0, Math.min(1, (t.clientX - rect.left) / rect.width));
      targetNY = Math.max(0, Math.min(1, (t.clientY - rect.top) / rect.height));
    };
    const handleTouchEnd = () => {
      // hand control back to the gyro a moment after the finger lifts
      touchReleaseTimer = setTimeout(() => {
        usingTouch = false;
      }, 400);
    };

    let motionListenerAttached = false;
    const enableMotionListener = () => {
      if (motionListenerAttached) return;
      motionListenerAttached = true;
      window.addEventListener("deviceorientation", handleOrientation);
    };

    const DOE =
      typeof window !== "undefined"
        ? (window as unknown as {
            DeviceOrientationEvent?: {
              requestPermission?: () => Promise<"granted" | "denied">;
            };
          }).DeviceOrientationEvent
        : undefined;
    const requiresPermission =
      isCoarsePointer && !!DOE && typeof DOE.requestPermission === "function";

    if (isCoarsePointer) {
      host.addEventListener("touchmove", handleTouchMove, { passive: true });
      host.addEventListener("touchend", handleTouchEnd, { passive: true });

      if (requiresPermission) {
        setNeedsMotionPermission(true);
        // The permission prompt itself is triggered from the button
        // below (must happen in a user-gesture handler on iOS). Once
        // granted, it fires this event so the running effect can
        // attach the actual listener.
        window.addEventListener("evven:motion-granted", enableMotionListener);
      } else if (DOE) {
        enableMotionListener();
        setMotionEnabled(true);
      }
    } else {
      host.addEventListener("mousemove", handleMouseMove);
    }

    // ---------------------------------------------------------------
    // Render loop
    // ---------------------------------------------------------------
    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          let v = grid[idx];
          if (v <= 0) continue;
          ctx.fillStyle = `rgba(255,255,255,${v * maxOpacity})`;
          ctx.fillRect(x * pixelSize + 1, y * pixelSize + 1, pixelSize - 2, pixelSize - 2);
          v -= fade;
          grid[idx] = v > 0 ? v : 0;
        }
      }
    };

    const drawBlob = () => {
      // gentle idle float, layered under the gyro/touch target so the
      // blob is always alive even when the phone is perfectly still
      driftT += 0.008;
      const driftX = Math.sin(driftT) * 0.035;
      const driftY = Math.cos(driftT * 0.75) * 0.035;

      curNX += (targetNX + driftX - curNX) * 0.05;
      curNY += (targetNY + driftY - curNY) * 0.05;

      const cx = curNX * cols;
      const cy = curNY * rows;
      const rad = Math.ceil(blobRad);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let dx = -rad; dx <= rad; dx++) {
        for (let dy = -rad; dy <= rad; dy++) {
          const x = Math.floor(cx) + dx;
          const y = Math.floor(cy) + dy;
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const dist = Math.hypot(x - cx, y - cy);
          if (dist > blobRad) continue;
          const strength = 1 - dist / blobRad;
          ctx.fillStyle = `rgba(255,255,255,${strength * strength * maxOpacity})`;
          ctx.fillRect(x * pixelSize + 1, y * pixelSize + 1, pixelSize - 2, pixelSize - 2);
        }
      }
    };

    const loop = () => {
      if (isCoarsePointer) drawBlob();
      else drawTrail();
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 }
    );
    io.observe(host);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      if (touchReleaseTimer) clearTimeout(touchReleaseTimer);
      if (!isCoarsePointer) {
        host.removeEventListener("mousemove", handleMouseMove);
      } else {
        host.removeEventListener("touchmove", handleTouchMove);
        host.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("deviceorientation", handleOrientation);
        window.removeEventListener("evven:motion-granted", enableMotionListener);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pixelSize, radius, fade, maxOpacity, blobRadius]);

  const requestMotionPermission = async () => {
    try {
      const DOE = (
        window as unknown as {
          DeviceOrientationEvent?: {
            requestPermission?: () => Promise<"granted" | "denied">;
          };
        }
      ).DeviceOrientationEvent;
      const state = await DOE?.requestPermission?.();
      if (state === "granted") {
        setMotionEnabled(true);
        window.dispatchEvent(new Event("evven:motion-granted"));
      }
    } catch {
      // ignore — user can still use touch-drag as a fallback
    } finally {
      setNeedsMotionPermission(false);
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-[1] block h-full w-full ${className}`.trim()}
      />
      {needsMotionPermission && !motionEnabled && (
        <button
          type="button"
          onClick={requestMotionPermission}
          className="absolute right-3 top-3 z-20 rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur-md transition-opacity active:opacity-70"
          style={{
            background: "rgba(255,255,255,0.16)",
            color: "var(--evven-text-inverse)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          Enable tilt ✨
        </button>
      )}
    </>
  );
}