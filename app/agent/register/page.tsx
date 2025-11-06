"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiPost } from "@/app/lib/api";

export default function AgentRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactPerson: "",
    phone: "",
    licenseNumber: "",
  });

  const totalSteps = 1;
  const progress = (step / totalSteps) * 100;

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await apiPost("auth/register", {
        email: formData.email,
        password: formData.password,
        name: formData.organizationName,
        role: "AGENT",
      });
      toast.success("Registration successful. Please log in.");
      window.location.href = "/agent/login";
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header
          title="Talent Scout"
          navItems={[
            { label: "Home", href: "/" },
            { label: "Players", href: "/players" },
            { label: "Clubs", href: "/clubs" },
            { label: "Partners", href: "/partners" },
            { label: "Academy", href: "/academy" },
          ]}
          rightAction={
            <Link
              href="/agent/login"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#233648] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Log In</span>
            </Link>
          }
        />
        <div className="px-40 flex flex-1 justify-center py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1"
          >
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-white text-base font-medium leading-normal">
                  Step {step} of {totalSteps}
                </p>
              </div>
              <div className="rounded bg-[#324d67]">
                <motion.div
                  className="h-2 rounded bg-[#1172d4]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Create your account
            </h2>
            <form onSubmit={handleNext} className="flex flex-col gap-4">
              {step === 1 && (
                <>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <Input
                      type="text"
                      label="Organization Name"
                      placeholder="Enter your club or agency name"
                      value={formData.organizationName}
                      onChange={(e) =>
                        setFormData({ ...formData, organizationName: e.target.value })
                      }
                      required
                      className="border-none bg-[#233648] focus:border-none"
                    />
                  </div>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <Input
                      type="email"
                      label="Email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="border-none bg-[#233648] focus:border-none"
                    />
                  </div>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <Input
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      className="border-none bg-[#233648] focus:border-none"
                    />
                  </div>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
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
                      required
                      className="border-none bg-[#233648] focus:border-none"
                    />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <Input
                      type="text"
                      label="Contact Person"
                      placeholder="Enter contact person name"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPerson: e.target.value,
                        })
                      }
                      required
                      className="border-none bg-[#233648] focus:border-none"
                    />
                  </div>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <Input
                      type="tel"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      className="border-none bg-[#233648] focus:border-none"
                    />
                  </div>
                  <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                    <Input
                      type="text"
                      label="License Number (Optional)"
                      placeholder="Enter license number if applicable"
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseNumber: e.target.value })
                      }
                      className="border-none bg-[#233648] focus:border-none"
                    />
                  </div>
                </>
              )}
              {step === 3 && (
                <div className="px-4 py-3">
                  <p className="text-[#92adc9] text-sm font-normal leading-normal mb-4">
                    Review your information and complete registration.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between py-2 border-b border-[#324d67]">
                      <span className="text-[#92adc9] text-sm">Organization:</span>
                      <span className="text-white text-sm">{formData.organizationName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#324d67]">
                      <span className="text-[#92adc9] text-sm">Email:</span>
                      <span className="text-white text-sm">{formData.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#324d67]">
                      <span className="text-[#92adc9] text-sm">Contact Person:</span>
                      <span className="text-white text-sm">{formData.contactPerson}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#324d67]">
                      <span className="text-[#92adc9] text-sm">Phone:</span>
                      <span className="text-white text-sm">{formData.phone}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex px-4 py-3 justify-end gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" size="default">
                  {step === totalSteps ? "Complete Registration" : "Next"}
                </Button>
              </div>
            </form>
            <Link
              href="/agent/login"
              className="text-[#92adc9] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline"
            >
              Already have an account? Log In
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


