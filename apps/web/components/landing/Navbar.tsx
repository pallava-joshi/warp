"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] backdrop-blur-md bg-[#0B0F2A]/80"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="#" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#6D28FF]">
              <div className="h-2 w-2 rotate-45 bg-white" />
            </div>
            <span className="text-xl font-semibold text-white">Autometa</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              Get a Demo
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-4 border-t border-white/10"
          >
            <Link
              href="#"
              onClick={() => setMobileOpen(false)}
              className="block text-[#A1A1AA] hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/demo"
              onClick={() => setMobileOpen(false)}
              className="block text-[#A1A1AA] hover:text-white"
            >
              Get a Demo
            </Link>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
