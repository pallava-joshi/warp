"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const TRUSTED_LOGOS = [
  "Adobe",
  "Mercedes Benz",
  "NETFLIX",
  "Discord",
  "Canva",
  "Wish",
  "Forbes",
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#6D28FF]/20 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#4F46E5]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-1.5 text-sm text-[#A855F7] mb-6"
          >
            AI Introducing
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          >
            Revolutionize Your AI{" "}
            <span className="bg-gradient-to-r from-white to-[#A855F7] bg-clip-text text-transparent">
              Experience
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-[#A1A1AA]"
          >
            AI isn&apos;t sci-fi. It&apos;s here. Harness it with AI to transform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Link
              href="/demo"
              className="group relative mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28FF] px-8 py-4 text-base font-medium text-white shadow-lg shadow-[#6D28FF]/30 transition-all duration-300 hover:shadow-[#6D28FF]/50 hover:brightness-110"
            >
              <span className="relative z-10">Get a Demo</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 mx-auto max-w-4xl"
          >
            <div className="rounded-2xl border border-white/10 bg-[#11152E]/90 p-1 shadow-2xl shadow-[#6D28FF]/20 backdrop-blur-sm">
              <div className="rounded-xl bg-[#0B0F2A] p-6 overflow-hidden">
                <div className="flex gap-4">
                  <div className="w-16 shrink-0 space-y-3">
                    <div className="h-2 w-8 rounded bg-white/20" />
                    <div className="h-2 w-6 rounded bg-[#7C3AED]/50" />
                    <div className="h-2 w-6 rounded bg-white/10" />
                    <div className="h-2 w-6 rounded bg-white/10" />
                    <div className="h-2 w-6 rounded bg-white/10" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-20 rounded-lg bg-[#131735] border border-white/5"
                        />
                      ))}
                    </div>
                    <div className="h-32 rounded-lg bg-[#131735] border border-white/5 flex items-center justify-center">
                      <div className="w-full max-w-xs h-12 rounded bg-gradient-to-r from-[#7C3AED]/20 to-[#6D28FF]/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-16"
          >
            <p className="text-sm text-[#6B7280] mb-6">Trusted by</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              {TRUSTED_LOGOS.map((name) => (
                <span
                  key={name}
                  className="text-sm font-medium text-white/70"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
