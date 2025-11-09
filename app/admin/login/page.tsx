"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLogin() {
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
      const session = await fetch("/api/auth/session").then(r => r.json());
      if (session?.user?.role === "ADMIN") {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Access denied. Admin only.");
        await signIn("signout");
      }
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="rounded-lg border border-[#324d67] bg-[#192633] p-8">
              <h1 className="text-white text-3xl font-bold mb-2 text-center">Admin Login</h1>
              <p className="text-[#92adc9] text-sm mb-6 text-center">Super Admin Access Only</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#324d67] bg-[#111a22]"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#324d67] bg-[#111a22]"
                  required
                />
                <Button type="submit" size="lg" className="w-full">
                  Login
                </Button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/" className="text-[#92adc9] text-sm hover:text-white">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}







