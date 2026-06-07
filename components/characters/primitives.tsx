"use client";

import { useState, useEffect, useRef } from "react";

// ─── Pupil ────────────────────────────────────────────────────────────────────

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

export const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
}: PupilProps) => {
  // pos is updated inside the mousemove effect — never read during render directly from ref
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      // If a forced direction is set, nothing to compute from mouse
      if (forceLookX !== undefined && forceLookY !== undefined) return;

      const el = pupilRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
      const angle = Math.atan2(dy, dx);
      setPos({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
    };

    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [maxDistance, forceLookX, forceLookY]);

  // When force values are provided, derive position directly from props — no ref needed
  const resolvedX = forceLookX !== undefined ? forceLookX : pos.x;
  const resolvedY = forceLookY !== undefined ? forceLookY : pos.y;

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${resolvedX}px, ${resolvedY}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

// ─── EyeBall ──────────────────────────────────────────────────────────────────

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

export const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
}: EyeBallProps) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (forceLookX !== undefined && forceLookY !== undefined) return;

      const el = eyeRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
      const angle = Math.atan2(dy, dx);
      setPos({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
    };

    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [maxDistance, forceLookX, forceLookY]);

  const resolvedX = forceLookX !== undefined ? forceLookX : pos.x;
  const resolvedY = forceLookY !== undefined ? forceLookY : pos.y;

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? "2px" : `${size}px`,
        backgroundColor: eyeColor,
        overflow: "hidden",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${resolvedX}px, ${resolvedY}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};