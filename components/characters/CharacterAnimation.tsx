"use client";

/**
 * CharacterAnimation
 *
 * Pure animation widget — zero form logic inside.
 * Wire it up from any parent by passing the form state props below.
 *
 * Props
 * ─────
 * isEmailFocused    – true while the email input has focus
 * isPasswordFocused – true while the password input has focus
 * password          – current password string (drives hiding/peeking behavior)
 * showPassword      – whether the password is currently visible (eye-toggle)
 */

import { useState, useEffect, useRef } from "react";
import { EyeBall, Pupil } from "./primitives";

export interface CharacterAnimationProps {
  isEmailFocused?: boolean;
  isPasswordFocused?: boolean;
  password?: string;
  showPassword?: boolean;
}

interface CharPos {
  faceX: number;
  faceY: number;
  bodySkew: number;
}

const ZERO_POS: CharPos = { faceX: 0, faceY: 0, bodySkew: 0 };

export function CharacterAnimation({
  isEmailFocused = false,
  isPasswordFocused = false,
  password = "",
  showPassword = false,
}: CharacterAnimationProps) {
  // ── Derived flags ──────────────────────────────────────────────────────────
  const isTyping = isEmailFocused || isPasswordFocused;
  const passwordHidden = password.length > 0 && !showPassword;
  const passwordVisible = password.length > 0 && showPassword;

  // ── Character DOM refs ─────────────────────────────────────────────────────
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  // ── Per-character positions — updated in mousemove effect, safe to render ──
  const [purplePos, setPurplePos] = useState<CharPos>(ZERO_POS);
  const [blackPos, setBlackPos] = useState<CharPos>(ZERO_POS);
  const [yellowPos, setYellowPos] = useState<CharPos>(ZERO_POS);
  const [orangePos, setOrangePos] = useState<CharPos>(ZERO_POS);

  useEffect(() => {
    const calcPos = (el: HTMLDivElement, mx: number, my: number): CharPos => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 3;
      const dx = mx - cx;
      const dy = my - cy;
      return {
        faceX: Math.max(-15, Math.min(15, dx / 20)),
        faceY: Math.max(-10, Math.min(10, dy / 30)),
        bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
      };
    };

    const handle = (e: MouseEvent) => {
      if (purpleRef.current) setPurplePos(calcPos(purpleRef.current, e.clientX, e.clientY));
      if (blackRef.current)  setBlackPos(calcPos(blackRef.current,  e.clientX, e.clientY));
      if (yellowRef.current) setYellowPos(calcPos(yellowRef.current, e.clientX, e.clientY));
      if (orangeRef.current) setOrangePos(calcPos(orangeRef.current, e.clientX, e.clientY));
    };

    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // ── Blinking ───────────────────────────────────────────────────────────────
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);

  useEffect(() => {
    const rand = () => Math.random() * 4000 + 3000;
    const schedule = (set: (v: boolean) => void): ReturnType<typeof setTimeout> => {
      return setTimeout(() => {
        set(true);
        setTimeout(() => {
          set(false);
          schedule(set);
        }, 150);
      }, rand());
    };
    const tP = schedule(setIsPurpleBlinking);
    const tB = schedule(setIsBlackBlinking);
    return () => {
      clearTimeout(tP);
      clearTimeout(tB);
    };
  }, []);

  // ── Look-at-each-other on typing start ────────────────────────────────────
  // Defer the synchronous setState to avoid the cascading-render lint error.
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);

  useEffect(() => {
    if (isTyping) {
      // Defer to next tick so we're not setting state synchronously in the effect body
      const immediate = setTimeout(() => setIsLookingAtEachOther(true), 0);
      const reset = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => {
        clearTimeout(immediate);
        clearTimeout(reset);
      };
    }
    const reset = setTimeout(() => setIsLookingAtEachOther(false), 0);
    return () => clearTimeout(reset);
  }, [isTyping]);

  // ── Sneaky purple peek when password is visible ────────────────────────────
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  useEffect(() => {
    if (!passwordVisible) {
      // Defer to avoid synchronous setState in effect
      const t = setTimeout(() => setIsPurplePeeking(false), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      },
      Math.random() * 3000 + 2000,
    );
    return () => clearTimeout(t);
  }, [passwordVisible, isPurplePeeking]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative" style={{ width: "550px", height: "400px" }}>

      {/* ── Purple – back layer ─────────────────────────────────────────────── */}
      <div
        ref={purpleRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "70px",
          width: "180px",
          height: isTyping || passwordHidden ? "440px" : "400px",
          backgroundColor: "#6C3FF5",
          borderRadius: "10px 10px 0 0",
          zIndex: 1,
          transform: passwordVisible
            ? "skewX(0deg)"
            : isTyping || passwordHidden
              ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
              : `skewX(${purplePos.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-700 ease-in-out"
          style={{
            left: passwordVisible
              ? "20px"
              : isLookingAtEachOther
                ? "55px"
                : `${45 + purplePos.faceX}px`,
            top: passwordVisible
              ? "35px"
              : isLookingAtEachOther
                ? "65px"
                : `${40 + purplePos.faceY}px`,
          }}
        >
          {[0, 1].map((i) => (
            <EyeBall
              key={i}
              size={18}
              pupilSize={7}
              maxDistance={5}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={isPurpleBlinking}
              forceLookX={
                passwordVisible
                  ? isPurplePeeking ? 4 : -4
                  : isLookingAtEachOther ? 3 : undefined
              }
              forceLookY={
                passwordVisible
                  ? isPurplePeeking ? 5 : -4
                  : isLookingAtEachOther ? 4 : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* ── Black – middle layer ────────────────────────────────────────────── */}
      <div
        ref={blackRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "240px",
          width: "120px",
          height: "310px",
          backgroundColor: "#2D2D2D",
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          transform: passwordVisible
            ? "skewX(0deg)"
            : isLookingAtEachOther
              ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`
              : isTyping || passwordHidden
                ? `skewX(${blackPos.bodySkew * 1.5}deg)`
                : `skewX(${blackPos.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-700 ease-in-out"
          style={{
            left: passwordVisible
              ? "10px"
              : isLookingAtEachOther
                ? "32px"
                : `${26 + blackPos.faceX}px`,
            top: passwordVisible
              ? "28px"
              : isLookingAtEachOther
                ? "12px"
                : `${32 + blackPos.faceY}px`,
          }}
        >
          {[0, 1].map((i) => (
            <EyeBall
              key={i}
              size={16}
              pupilSize={6}
              maxDistance={4}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={isBlackBlinking}
              forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
              forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined}
            />
          ))}
        </div>
      </div>

      {/* ── Orange semi-circle – front left ─────────────────────────────────── */}
      <div
        ref={orangeRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "0px",
          width: "240px",
          height: "200px",
          zIndex: 3,
          backgroundColor: "#FF9B6B",
          borderRadius: "120px 120px 0 0",
          transform: passwordVisible
            ? "skewX(0deg)"
            : `skewX(${orangePos.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-8 transition-all duration-200 ease-out"
          style={{
            left: passwordVisible ? "50px" : `${82 + orangePos.faceX}px`,
            top: passwordVisible ? "85px" : `${90 + orangePos.faceY}px`,
          }}
        >
          {[0, 1].map((i) => (
            <Pupil
              key={i}
              size={12}
              maxDistance={5}
              pupilColor="#2D2D2D"
              forceLookX={passwordVisible ? -5 : undefined}
              forceLookY={passwordVisible ? -4 : undefined}
            />
          ))}
        </div>
      </div>

      {/* ── Yellow rounded rect – front right ───────────────────────────────── */}
      <div
        ref={yellowRef}
        className="absolute bottom-0 transition-all duration-700 ease-in-out"
        style={{
          left: "310px",
          width: "140px",
          height: "230px",
          backgroundColor: "#E8D754",
          borderRadius: "70px 70px 0 0",
          zIndex: 4,
          transform: passwordVisible
            ? "skewX(0deg)"
            : `skewX(${yellowPos.bodySkew}deg)`,
          transformOrigin: "bottom center",
        }}
      >
        <div
          className="absolute flex gap-6 transition-all duration-200 ease-out"
          style={{
            left: passwordVisible ? "20px" : `${52 + yellowPos.faceX}px`,
            top: passwordVisible ? "35px" : `${40 + yellowPos.faceY}px`,
          }}
        >
          {[0, 1].map((i) => (
            <Pupil
              key={i}
              size={12}
              maxDistance={5}
              pupilColor="#2D2D2D"
              forceLookX={passwordVisible ? -5 : undefined}
              forceLookY={passwordVisible ? -4 : undefined}
            />
          ))}
        </div>
        {/* Mouth */}
        <div
          className="absolute w-20 h-1 bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
          style={{
            left: passwordVisible ? "10px" : `${40 + yellowPos.faceX}px`,
            top: passwordVisible ? "88px" : `${88 + yellowPos.faceY}px`,
          }}
        />
      </div>
    </div>
  );
}