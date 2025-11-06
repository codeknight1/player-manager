"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PasswordResetNew() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    toast.success("Password reset successfully!");
    window.location.href = "/player/login";
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
              Create new password
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <Input
                  type="password"
                  label="New Password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <Input
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex px-4 py-3">
                <Button type="submit" size="lg" className="flex-1">
                  Reset Password
                </Button>
              </div>
            </form>
            <Link
              href="/player/login"
              className="text-[#92adc9] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline"
            >
              Back to Login
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



