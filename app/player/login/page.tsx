"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PlayerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Invalid credentials");
    } else {
      toast.success("Login successful!");
      router.push("/player/dashboard");
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#111a22] overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#111a22]">
          <Image
            src="/professional-footballer-in-action-portrait-stadium.jpg"
            alt="Professional footballer in action"
            fill
            className="object-cover"
            priority
            quality={90}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1172d4]/30 via-[#1172d4]/10 to-[#111a22]/80 z-10" />
          <div className="relative z-20 flex flex-col justify-center items-start p-12 text-white">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                Welcome to Your
                <br />
                <span className="text-[#1172d4]">Professional Journey</span>
              </h1>
              <p className="text-xl text-[#92adc9] mb-8 max-w-md">
                Connect with top agents, showcase your talent, and take your career to the next level.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1172d4]" />
                  <span className="text-lg">Access to elite trials and tournaments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1172d4]" />
                  <span className="text-lg">Direct connection with agents and clubs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1172d4]" />
                  <span className="text-lg">Showcase your skills and achievements</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 md:w-1/2 flex justify-center p-6 md:p-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md py-8"
          >
            <div className="mb-8">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                Log in to your account
              </h2>
              <p className="text-[#92adc9] text-sm">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-6">
              <Input
                type="email"
                label="Email or Username"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#324d67] bg-[#192633]"
                required
              />
              <div>
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#324d67] bg-[#192633]"
                  required
                />
                <Link
                  href="/password-reset-request"
                  className="text-[#1172d4] text-sm font-normal hover:underline mt-2 block text-right"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" size="lg" className="w-full pt-2">
                Log In
              </Button>
            </form>

            <div className="text-center">
              <p className="text-[#92adc9] text-sm">
                Don't have an account?{" "}
                <Link href="/player/register" className="text-[#1172d4] hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



