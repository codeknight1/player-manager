"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiPost } from "@/app/lib/api";

export default function PlayerRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const totalSteps = 1;
  const progress = (step / totalSteps) * 100;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setIsSubmitting(true);
      const firstName = formData.firstName.trim();
      const lastName = formData.lastName.trim();
      await apiPost("auth/register", {
        email: formData.email.trim(),
        password: formData.password,
        name: `${firstName} ${lastName}`.trim(),
        role: "PLAYER",
      });
      toast.success("Registration successful. Please log in.");
      router.push("/player/login");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#111a22] overflow-hidden">
      <div className="flex flex-1 flex-col md:flex-row min-h-0">
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
                Start Your
                <br />
                <span className="text-[#1172d4]">Professional Journey</span>
              </h1>
              <p className="text-xl text-[#92adc9] mb-8 max-w-md">
                Join thousands of players connecting with top agents, showcasing their talent, and advancing their careers.
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1172d4]" />
                  <span className="text-lg">Create your professional profile</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1172d4]" />
                  <span className="text-lg">Get discovered by top clubs and agents</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1172d4]" />
                  <span className="text-lg">Access exclusive trials and opportunities</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 md:w-1/2 flex justify-center p-6 md:p-12 overflow-y-auto min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md py-4"
          >
            <div className="mb-8">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-2">
                Create your account
              </h2>
              <p className="text-[#92adc9] text-sm">
                Join PPM and start your professional journey today
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-white text-sm font-medium">
                  Step {step} of {totalSteps}
                </p>
              </div>
              <div className="rounded bg-[#324d67] h-2">
                <motion.div
                  className="h-2 rounded bg-[#1172d4]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <form onSubmit={handleNext} className="flex flex-col gap-5 mb-6">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      type="text"
                      label="First Name"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="border-[#324d67] bg-[#192633]"
                      required
                    />
                    <Input
                      type="text"
                      label="Last Name"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="border-[#324d67] bg-[#192633]"
                      required
                    />
                  </div>
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border-[#324d67] bg-[#192633]"
                    required
                  />
                  <Input
                    type="password"
                    label="Password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="border-[#324d67] bg-[#192633]"
                    required
                  />
                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="border-[#324d67] bg-[#192633]"
                    required
                  />
                </>
              )}
              <Button type="submit" size="lg" className="w-full pt-2 mt-2" disabled={isSubmitting}>
                {step === totalSteps ? "Create Account" : "Next"}
              </Button>
            </form>

            <div className="text-center mt-6 pb-4">
              <p className="text-[#92adc9] text-sm">
                Already have an account?{" "}
                <Link href="/player/login" className="text-[#1172d4] hover:underline font-semibold">
                  Log In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



