"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#111a22]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/professional-footballer-in-action-portrait-stadium.jpg"
          alt="Soccer field background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <header className="relative z-10 flex h-20 w-full items-center justify-center bg-[#233648]">
        <div className="flex items-center gap-3">
          <Image
            src="/PPM LOGO.png"
            alt="PPM"
            width={140}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 md:px-8 lg:px-16">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/p.jpg"
                alt="Player"
                fill
                className="object-cover object-center"
              />
              <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
              <h2 className="mb-2 text-2xl font-bold text-[#1172d4]">Player</h2>
              <p className="mb-6 text-sm text-[#92adc9]">Apply to Offers</p>
              <Link
                href="/player/login"
                className="flex items-center justify-center rounded-lg bg-[#1172d4] px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                Login
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/p.jpg"
                alt="Agent"
                fill
                className="object-cover object-center"
              />
              <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
              <h2 className="mb-2 text-2xl font-bold text-[#1172d4]">Agent</h2>
              <p className="mb-6 text-sm text-[#92adc9]">Manage Applicants</p>
              <Link
                href="/agent/login"
                className="flex items-center justify-center rounded-lg bg-[#1172d4] px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                Login
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/p.jpg"
                alt="Academy"
                fill
                className="object-cover object-center"
              />
              <div className="absolute bottom-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
              <h2 className="mb-2 text-2xl font-bold text-[#1172d4]">Academy</h2>
              <p className="mb-6 text-sm text-[#92adc9]">Hire</p>
              <Link
                href="/academy/login"
                className="flex items-center justify-center rounded-lg bg-[#1172d4] px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}



