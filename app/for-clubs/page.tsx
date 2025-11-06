"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserIcon, MagnifyingGlassIcon, HandshakeIcon, TrophyIcon } from "@/components/icons";

const features = [
  {
    icon: <MagnifyingGlassIcon size={32} />,
    title: "Advanced Scouting",
    description: "Search and filter through thousands of player profiles with advanced filters and matching algorithms.",
  },
  {
    icon: <UserIcon size={32} />,
    title: "Player Database",
    description: "Access comprehensive player profiles with stats, videos, achievements, and performance analytics.",
  },
  {
    icon: <HandshakeIcon size={32} />,
    title: "Direct Communication",
    description: "Connect directly with players and their agents through our integrated messaging system.",
  },
  {
    icon: <TrophyIcon size={32} />,
    title: "Trial Management",
    description: "Organize and manage trial invitations, evaluations, and player assessments efficiently.",
  },
];

const benefits = [
  "Access to verified player profiles and statistics",
  "Advanced search and filtering capabilities",
  "Direct contact with players and agents",
  "Trial and evaluation management tools",
  "Comprehensive player analytics and reports",
];

export default function ForClubsPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Global Header is rendered in app/layout.tsx */}
        <div className="flex flex-1 flex-col">
          {/* Hero Section */}
          <section className="px-40 py-20 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <h1 className="text-white text-5xl font-bold mb-6">Find Your Next Star Player</h1>
              <p className="text-[#92adc9] text-xl mb-8 leading-relaxed">
                Connect with talented players, manage scouting operations, and discover hidden gems with our comprehensive platform for clubs and agents.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/agent/login">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/explore-opportunities">
                  <Button variant="secondary" size="lg">Browse Players</Button>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Features Section */}
          <section className="px-40 py-16 bg-[#192633]">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-white text-3xl font-bold mb-4">
                  Powerful Tools for Clubs & Agents
                </h2>
                <p className="text-[#92adc9] text-lg">
                  Everything you need to discover, evaluate, and recruit top talent
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 p-6 rounded-lg border border-[#324d67] hover:border-[#1172d4] transition-colors"
                  >
                    <div className="text-[#1172d4] flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="text-white text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[#92adc9] text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="px-40 py-16">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-white text-3xl font-bold mb-4">
                  Why Clubs & Agents Choose Us
                </h2>
              </motion.div>
              <div className="flex flex-col gap-4">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-[#192633] border border-[#324d67]"
                  >
                    <div className="text-[#0bda5b] text-xl">✓</div>
                    <p className="text-white text-base">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="px-40 py-16 bg-[#192633]">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { number: "10,000+", label: "Active Players" },
                  { number: "500+", label: "Professional Clubs" },
                  { number: "1,200+", label: "Verified Agents" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center p-6 rounded-lg border border-[#324d67]"
                  >
                    <p className="text-[#1172d4] text-4xl font-bold mb-2">
                      {stat.number}
                    </p>
                    <p className="text-[#92adc9] text-base">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-40 py-20 bg-gradient-to-r from-[#1172d4] to-[#0f62b9]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-white text-4xl font-bold mb-4">
                Start Discovering Talent Today
              </h2>
                <p className="text-white/90 text-lg mb-8">Join leading clubs and agents who trust PPM for their recruitment needs</p>
              <Link href="/agent/login">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Get Access Now
                </Button>
              </Link>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}


