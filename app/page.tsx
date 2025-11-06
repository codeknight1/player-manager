"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center px-40 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-white text-5xl font-bold mb-4">Welcome to PPM</h1>
            <p className="text-[#92adc9] text-xl mb-8">Professional Player Management Platform</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/player/login"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#1172d4] text-white text-base font-bold"
              >
                Player Login
              </Link>
              <Link
                href="/agent/login"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#233648] text-white text-base font-bold"
              >
                Agent Login
              </Link>
              <Link
                href="/academy/login"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#233648] text-white text-base font-bold"
              >
                Academy Login
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center justify-center rounded-lg h-12 px-6 bg-[#ef4444] text-white text-base font-bold"
              >
                Admin Login
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



