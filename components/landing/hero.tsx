"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";

import Grainient from "@/components/ui/Grainient";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const characterRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!characterRef.current) return;

    const tl = gsap.timeline();

    tl.from(labelRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    })
      .from(
        headingRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.35"
      )
      .from(
        paragraphRef.current,
        {
          y: 25,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.45"
      )
      .from(
        buttonsRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        characterRef.current,
        {
          opacity: 0,
          x: 40,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8"
      );

    gsap.to(characterRef.current, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 25;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;

      gsap.to(characterRef.current, {
        x,
        y,
        duration: 1,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      tl.kill();
    };
  }, []);

  return (
    <section className="relative h-[120vh] w-screen overflow-hidden bg-background">
      {/* Background Grid Distortion */}
      <div className="absolute inset-0 flex h-[120vh] w-full items-center justify-center">
        <Grainient
          color1="#325149"
          color2="#faf8f5"
          color3="#8b8480"
          timeSpeed={1.2}
          colorBalance={-0.07}
          warpStrength={0.3}
          warpFrequency={3.7}
          warpSpeed={1.4}
          warpAmplitude={50}
          blendAngle={29}
          blendSoftness={0.64}
          rotationAmount={580}
          noiseScale={1.65}
          grainAmount={0.06}
          grainScale={5}
          grainAnimated={false}
          contrast={1.35}
          gamma={0.95}
          saturation={1.3}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex h-[100vh] w-full items-center">
        {/* Left Content */}
        <div className="ml-[15vw] flex w-full max-w-[720px] flex-col">
          <span
            ref={labelRef}
            className="mb-8 text-xs font-medium uppercase tracking-[0.35em] text-[#000000]"
          >
            Smart Expense Splitting
          </span>

          <h1
            ref={headingRef}
            className="font-hero-heading text-7xl font-black leading-[1]  text-slate-900 md:text-7xl lg:text-[6.5rem]"
          >
            Split bills.
            <br />
            Not friendships.
          </h1>

          <p
            ref={paragraphRef}
            className="mt-10 max-w-[520px] text-lg leading-[1.75] text-slate-700"
          >
            Track expenses, settle balances instantly, and keep everyone on the
            same page without awkward money conversations.
          </p>

          <div
            ref={buttonsRef}
            className="mt-14 flex items-center gap-6"
          >
            <Link
              href="/signup"
              className="
                group
                inline-flex items-center gap-2
                rounded-full
                bg-slate-900
                px-6 py-3
                text-sm font-medium text-white
                transition-all duration-300
                hover:scale-[1.02]
              "
            >
              Get Started

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <button
              className="
                text-sm
                font-medium
                text-slate-700
                transition-colors duration-300
                hover:text-slate-900
              "
            >
              Learn More →
            </button>
          </div>
        </div>

        {/* Character */}
        <div
          ref={characterRef}
          className="absolute right-50 bottom-0 hidden lg:block"
        >
          <Image
            src="/hero-img.png"
            alt="Hero Character"
            width={600}
            height={800}
            priority
            className="
              pointer-events-none
              select-none
              object-contain
              animate-[float_6s_ease-in-out_infinite]
              -scale-x-100
            "
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom blur gradient */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[20vh] bg-gradient-to-b from-transparent to-[#faf8f5]" />
    </section>
  );
}