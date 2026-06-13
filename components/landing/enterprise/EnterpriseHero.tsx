"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Grainient from "@/components/ui/Grainient";
import { useRef ,useEffect} from "react";
import Image from 'next/image';
import gsap from "gsap";


export function EnterpriseHero() {
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
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <Grainient
          color1="#6e1f2e"
          color2="#faf6f6"
          color3="#9c8a8c"
          timeSpeed={1.0}
          colorBalance={-0.05}
          warpStrength={0.28}
          warpFrequency={3.4}
          warpSpeed={1.2}
          warpAmplitude={50}
          blendAngle={29}
          blendSoftness={0.6}
          rotationAmount={520}
          noiseScale={1.6}
          grainAmount={0.06}
          grainScale={5}
          grainAnimated={false}
          contrast={1.35}
          gamma={0.95}
          saturation={1.15}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="relative z-10 flex h-[100vh] w-full items-center">
        <div className="ml-[15vw] flex w-full max-w-[720px] flex-col">
          <span
            ref={labelRef}
            className="mb-8 text-xs font-medium uppercase tracking-[0.35em] text-black"
          >
            Enterprise Expense Management
          </span>

          <h1
            ref={headingRef}
            className="text-7xl font-black text-slate-900 md:text-7xl lg:text-[6.5rem] leading-none whitespace-nowrap"
            >
            Expense control,
            <br />
            at scale.
            </h1>

          <p
            ref={paragraphRef}
            className="mt-10 max-w-[520px] text-lg leading-[1.75] text-slate-700"
          >
            Centralize spend across departments and offices with enterprise-grade
            security, approval workflows, and reporting built for finance teams.
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
              Request a demo

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#how-it-works"
              className="
                text-sm
                font-medium
                text-slate-700
                transition-colors duration-300
                hover:text-slate-900
              "
            >
              Learn More →
            </a>
          </div>
        </div>

        <div
          ref={characterRef}
          className="
            absolute
            right-55
            top-40
            hidden
            lg:block
            z-10
          "
        >
          <Image
            src="/hero-enterprise-img.png"
            alt="Enterprise Character"
            width={420}
            height={650}
            priority
            className="
              pointer-events-none
              select-none
              object-contain
            "
            draggable={false}
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 h-[20vh] bg-gradient-to-b from-transparent to-[var(--evven-background)]" />
    </section>
  );
}

