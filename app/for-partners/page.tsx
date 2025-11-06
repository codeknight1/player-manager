"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrophyIcon, UsersThreeIcon, HandshakeIcon, EyeIcon } from "@/components/icons";

const features = [
  {
    icon: <TrophyIcon size={32} />,
    title: "Tournament Management",
    description: "Organize and manage tournaments, track participation, and showcase your events to attract top talent.",
  },
  {
    icon: <UsersThreeIcon size={32} />,
    title: "Squad Management",
    description: "Efficiently manage multiple squads, track player development, and monitor team performance.",
  },
  {
    icon: <HandshakeIcon size={32} />,
    title: "Partnership Network",
    description: "Connect with clubs, agents, and other academies to expand opportunities for your players.",
  },
  {
    icon: <EyeIcon size={32} />,
    title: "Player Exposure",
    description: "Increase visibility for your academy players and help them get discovered by professional clubs.",
  },
];

const benefits = [
  "Comprehensive tournament and event management",
  "Advanced squad and player tracking tools",
  "Partnership opportunities with clubs and agents",
  "Player exposure and scouting analytics",
  "Integration with professional networks",
];

export default function ForPartnersPage() {
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
              <h1 className="text-white text-5xl font-bold mb-6">Elevate Your Academy</h1>
              <p className="text-[#92adc9] text-xl mb-8 leading-relaxed">
                Manage tournaments, showcase talent, and connect your academy with professional clubs and agents worldwide.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/academy/register">
                  <Button size="lg">Join as Academy</Button>
                </Link>
                <Link href="/academy/login">
                  <Button variant="secondary" size="lg">Sign In</Button>
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
                  Complete Academy Management
                </h2>
                <p className="text-[#92adc9] text-lg">
                  Comprehensive tools designed for football academies and partner organizations
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
                  Why Academies Trust TalentVerse
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

          {/* Use Cases Section */}
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
                  Perfect For
                </h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Youth Academies",
                    description: "Manage multiple age groups and squads efficiently",
                  },
                  {
                    title: "Tournament Organizers",
                    description: "Organize events and showcase talent to scouts",
                  },
                  {
                    title: "Training Centers",
                    description: "Track player development and provide exposure",
                  },
                ].map((useCase, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-lg border border-[#324d67] bg-[#111a22]"
                  >
                    <h3 className="text-white text-lg font-bold mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-[#92adc9] text-sm">{useCase.description}</p>
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
                Grow Your Academy Network
              </h2>
                <p className="text-white/90 text-lg mb-8">Join successful academies using PPM to manage operations and connect with opportunities</p>
              <Link href="/academy/register">
                <Button size="lg" variant="secondary" className="min-w-[200px]">
                  Register Your Academy
                </Button>
              </Link>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}


