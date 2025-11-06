"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AcademyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      window.location.href = "/academy/dashboard";
    }
  };

  const handleDemo = async () => {
    const result = await signIn("credentials", {
      email: "academy@demo.com",
      password: "demo123",
      redirect: false,
    });
    if (result?.error) {
      toast.error("Demo login failed");
    } else {
      toast.success("Demo login: Academy");
      window.location.href = "/academy/dashboard";
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1"
          >
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Academy Login
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <Input
                  type="text"
                  label="Email or Username"
                  placeholder="Enter your email or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Link
                href="/password-reset-request"
                className="text-[#92adc9] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline"
              >
                Forgot Password?
              </Link>
              <div className="flex px-4 py-3 gap-3">
                <Button type="submit" size="lg" className="flex-1">
                  Log In
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={handleDemo}>
                  Demo Login
                </Button>
              </div>
            </form>
            <div className="mx-4 mt-2 rounded-lg border border-[#233648] bg-[#0f1620] p-4">
              <p className="text-white text-sm font-semibold mb-1">Demo credentials</p>
              <p className="text-[#92adc9] text-xs">Email: academy@demo.com • Password: demo123</p>
            </div>
            <Link
              href="/academy/register"
              className="text-[#92adc9] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline"
            >
              Don't have an account? Sign Up
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}




