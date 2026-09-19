"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b-4 border-[#111111] shadow-[0_4px_0_#111111] shrink-0">
      <div className="section-container flex items-center justify-between h-20">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
        >
          <div className="w-10 h-10 bg-[#FFD600] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center font-mono font-black text-xl group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#111111] transition-all">
            SQ
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tight text-xl leading-none">
              SQLENS
            </span>
            <span className="font-mono text-xs font-semibold text-[#555555] uppercase tracking-wider">
              Database Query Tutor
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-6 font-bold text-sm tracking-wide uppercase"
          aria-label="Main Navigation"
        >
          <a
            href="#problem"
            className="hover:text-[#FFD600] hover:bg-[#111111] px-2.5 py-1.5 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#FFD600] hover:bg-[#111111] px-2.5 py-1.5 transition-colors"
          >
            Visual Stages
          </a>
          <a
            href="#features"
            className="hover:text-[#FFD600] hover:bg-[#111111] px-2.5 py-1.5 transition-colors"
          >
            Features
          </a>
          <a
            href="#demo"
            className="hover:text-[#FFD600] hover:bg-[#111111] px-2.5 py-1.5 transition-colors"
          >
            Interactive Demo
          </a>
          <a
            href="#ai-tutor"
            className="hover:text-[#FFD600] hover:bg-[#111111] px-2.5 py-1.5 transition-colors"
          >
            AI Tutor
          </a>
        </nav>

        {/* Header Auth Container (Desktop) */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-3.5 py-2 font-mono font-bold text-xs uppercase tracking-wider text-[#111111] hover:bg-[#FFF3A3] border-2 border-transparent hover:border-[#111111] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="neo-btn text-xs py-2 px-4 shadow-[2px_2px_0_#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            Register
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 border-2 border-[#111111] bg-[#FFD600] shadow-[3px_3px_0_#111111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          aria-label="Buka Menu Navigasi"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileOpen && (
        <nav
          className="md:hidden flex flex-col bg-[#FFFFFF] border-t-2 border-b-4 border-[#111111] px-6 py-6 space-y-4 shadow-[0_6px_0_#111111]"
          aria-label="Mobile Navigation"
        >
          <button
            type="button"
            onClick={() => scrollToSection("problem")}
            className="text-left font-bold uppercase tracking-wider text-sm py-2 border-b border-[#EAEAE4] cursor-pointer"
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("how-it-works")}
            className="text-left font-bold uppercase tracking-wider text-sm py-2 border-b border-[#EAEAE4] cursor-pointer"
          >
            Visual Stages
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("features")}
            className="text-left font-bold uppercase tracking-wider text-sm py-2 border-b border-[#EAEAE4] cursor-pointer"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("demo")}
            className="text-left font-bold uppercase tracking-wider text-sm py-2 border-b border-[#EAEAE4] cursor-pointer"
          >
            Interactive Demo
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("ai-tutor")}
            className="text-left font-bold uppercase tracking-wider text-sm py-2 border-b border-[#EAEAE4] cursor-pointer"
          >
            AI Tutor
          </button>

          <div className="pt-2 border-t-2 border-[#111111]">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-3 bg-white hover:bg-neutral-100 border-2 border-[#111111] font-mono font-bold text-xs uppercase text-center shadow-[2px_2px_0_#111111]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="neo-btn text-center text-xs py-2.5"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
