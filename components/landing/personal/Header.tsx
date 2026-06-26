"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const outsideButton = buttonRef.current && !buttonRef.current.contains(target);
      const outsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      if (outsideButton && outsideDropdown) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close menu on resize to avoid layout issues
  useEffect(() => {
    const handleResize = () => setOpen(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(12px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <>
      {/* Logo */}
      <div
        className="fixed top-5 left-4 z-50 sm:top-6 sm:left-6 md:top-8 md:left-8 lg:left-12"
        style={{ mixBlendMode: "difference" }}
      >
        <Link href="/" className="pointer-events-auto">
          <Image
            src="/EvenUp-white.svg"
            alt="EvenUp"
            width={70}
            height={70}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px]"
          />
        </Link>
      </div>

      {/* Menu Button — mirrors logo position on the right */}
      <div
        ref={buttonRef}
        className="fixed top-7 right-6 z-50 sm:top-8 sm:right-8 md:top-10 md:right-10 lg:right-14"
        style={{ mixBlendMode: "difference" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className="flex items-center transition-all duration-300 hover:scale-[1.03]"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <X size={36} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Menu size={36} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.4, ease: smoothEase }}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)", y: -8 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(20px)" }}
              transition={{ duration: 0.55, ease: smoothEase }}
              className="
                fixed z-50
                inset-x-4 top-20
                sm:inset-x-6 sm:top-20
                md:left-auto md:right-16 md:top-28 md:w-[500px]
                lg:right-20
              "
            >
              <div
                className="
                  rounded-[28px] md:rounded-[40px]
                  border border-white/10
                  bg-white
                  backdrop-blur-[40px]
                  shadow-2xl
                  p-6 sm:p-8 md:p-10
                "
              >
                <motion.nav
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col"
                >
                  {[
                    { href: "/", label: "Personal" },
                    { href: "/teams", label: "Teams" },
                    { href: "/enterprise", label: "Enterprise" },
                  ].map(({ href, label }) => (
                    <motion.div
                      key={href}
                      variants={itemVariants}
                      transition={{ duration: 0.8, ease: smoothEase }}
                    >
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className="block py-3 md:py-4 text-2xl sm:text-3xl md:text-4xl font-medium"
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.8, ease: smoothEase }}
                  >
                    <a
                      href="https://github.com/Evven-hq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-3 md:py-4 text-2xl sm:text-3xl md:text-4xl font-medium"
                    >
                      GitHub
                    </a>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    transition={{ duration: 0.8, ease: smoothEase }}
                    className="my-6 md:my-8 h-px bg-white/10"
                  />

                  <div className="flex flex-wrap gap-3">
                    <motion.div
                      variants={itemVariants}
                      transition={{ duration: 0.8, ease: smoothEase }}
                    >
                      <Link
                        href="/login"
                        className="
                          inline-flex w-fit rounded-full
                          bg-(--evven-accent-primary)
                          px-5 py-2.5 md:px-6 md:py-3
                          text-white font-medium text-sm md:text-base
                        "
                      >
                        Login
                      </Link>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      transition={{ duration: 0.8, ease: smoothEase }}
                    >
                      <Link
                        href="/signup"
                        className="
                          inline-flex w-fit rounded-full
                          bg-white
                          px-5 py-2.5 md:px-6 md:py-3
                          text-black font-medium text-sm md:text-base
                        "
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </div>
                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
