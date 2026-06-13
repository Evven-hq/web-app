"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = footerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className={`
        relative
        overflow-hidden
        bg-[var(--evven-accent-primary)]
        text-white
        transition-all
        duration-1000
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "8.333% 100%",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col py-20 lg:py-24">
        {/* Top statement */}
        <div className="px-6 md:px-10 lg:px-14 pt-20 md:pt-24">
          <h2
            className="
              font-heading
              max-w-3xl
              text-[clamp(3rem,6vw,6rem)]
              leading-[0.88]
              tracking-[-0.08em]
            "
          >
            Split fairly.
            <br />
            Stay friends.
          </h2>
        </div>

        {/* Center logo */}
        <div className="flex flex-1 items-center justify-center">
          <h1
            className="
              select-none
              font-heading
              font-bold
              leading-none
              tracking-[-0.08em]
              text-[clamp(6rem,18vw,18rem)]
              text-white/95
            "
          >
            EVVEN
          </h1>
        </div>

        {/* Bottom content */}
        <div className="border-t border-white/10">
          <div className="grid lg:grid-cols-[1fr_auto]">
            {/* Content */}
            <div className="px-6 md:px-10 lg:px-14 py-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {/* Product */}
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-white/50">
                    Product
                  </p>

                  <div className="flex flex-col gap-3 text-sm text-white/70">
                    <Link href="#features" className="hover:text-white transition-colors">
                      Features
                    </Link>

                    <Link href="#pricing" className="hover:text-white transition-colors">
                      Pricing
                    </Link>

                    <Link href="#faq" className="hover:text-white transition-colors">
                      FAQ
                    </Link>

                    <Link href="#security" className="hover:text-white transition-colors">
                      Security
                    </Link>
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-white/50">
                    Resources
                  </p>

                  <div className="flex flex-col gap-3 text-sm text-white/70">
                    <Link href="#faq" className="hover:text-white transition-colors">
                      FAQ
                    </Link>

                    <Link href="#" className="hover:text-white transition-colors">
                      Guides
                    </Link>

                    <Link href="#" className="hover:text-white transition-colors">
                      Support
                    </Link>

                    <Link href="#" className="hover:text-white transition-colors">
                      Status
                    </Link>
                  </div>
                </div>

                {/* Company */}
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-white/50">
                    Company
                  </p>

                  <div className="flex flex-col gap-3 text-sm text-white/70">
                    <Link href="/about" className="hover:text-white transition-colors">
                      About
                    </Link>

                    <a
                      href="mailto:hello@evven.app"
                      className="hover:text-white transition-colors"
                    >
                      Contact
                    </a>

                    <Link href="/privacy" className="hover:text-white transition-colors">
                      Privacy
                    </Link>

                    <Link href="/terms" className="hover:text-white transition-colors">
                      Terms
                    </Link>
                  </div>
                </div>

                {/* Social */}
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-white/50">
                    Social
                  </p>

                  <div className="flex flex-col gap-3 text-sm text-white/70">
                    <a href="#" className="hover:text-white transition-colors">
                      GitHub
                    </a>

                    <a href="#" className="hover:text-white transition-colors">
                      X
                    </a>

                    <a href="#" className="hover:text-white transition-colors">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row md:justify-between gap-8">
                <p className="max-w-md text-sm leading-relaxed text-white/55">
                  Less time settling bills.<br />
                  More time making memories.
                </p>

                <div className="md:ml-auto">
                  <p className="text-[11px] tracking-[0.15em] text-white/40">
                    © {year} EVVEN
                  </p>
                </div>
              </div>
            </div>

            {/* Reserved illustration space */}
            <div className="hidden lg:block w-[420px]" />
          </div>
        </div>
      </div>

      {/* Character */}
        <div
          className="
            pointer-events-none
            absolute
            right-[-3rem]
            bottom-[-0.9rem]
            z-20
            w-[38vw]
            h-[38vw]
            min-w-[360px]
            min-h-[360px]
            max-w-[700px]
            max-h-[700px]
            select-none
          "
        >
          <Image
            src="/footer-img.png"
            alt=""
            fill
            priority
            className="object-contain object-bottom-right"
          />
        </div>
    </footer>
  );
}