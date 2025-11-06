"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, TrophyIcon, ShieldCheckIcon, ListChecksIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sidebarItems = [
  {
    label: "Home",
    href: "/agent/dashboard",
    icon: <HouseIcon size={24} weight="fill" />,
  },
  {
    label: "Players",
    href: "/agent/players",
    icon: <UserIcon size={24} />,
  },
  {
    label: "Scouts",
    href: "/agent/scouts",
    icon: <MagnifyingGlassIcon size={24} />,
  },
  {
    label: "Messages",
    href: "/agent/messages",
    icon: <ChatIcon size={24} />,
  },
  {
    label: "Settings",
    href: "/agent/settings",
    icon: <GearIcon size={24} />,
  },
  {
    label: "Trials",
    href: "/agent/trials",
    icon: <TrophyIcon size={24} />,
  },
  {
    label: "Verification",
    href: "/agent/verification",
    icon: <ShieldCheckIcon size={24} />,
  },
  {
    label: "Recruitment",
    href: "/agent/recruitment",
    icon: <ListChecksIcon size={24} />,
  },
];

export default function AgentSettingsPage() {
  const [settings, setSettings] = useState({
    organizationName: "Elite Football Agency",
    email: "contact@elitefootball.com",
    phone: "+44 20 1234 5678",
    notificationEmail: true,
    notificationSMS: false,
    notificationPush: true,
  });

  const handleSave = () => {
    // Handle save logic
    alert("Settings saved!");
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="ScoutHub"
            subtitle="Club"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  Settings
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Manage your account and preferences
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-4">
              {/* Profile Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 rounded-lg border border-[#324d67] p-6"
              >
                <h3 className="text-white text-xl font-bold">Profile Information</h3>
                <div className="flex flex-col gap-4">
                  <Input
                    type="text"
                    label="Organization Name"
                    value={settings.organizationName}
                    onChange={(e) =>
                      setSettings({ ...settings, organizationName: e.target.value })
                    }
                    className="border-[#324d67] bg-[#192633]"
                  />
                  <Input
                    type="email"
                    label="Email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="border-[#324d67] bg-[#192633]"
                  />
                  <Input
                    type="tel"
                    label="Phone Number"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="border-[#324d67] bg-[#192633]"
                  />
                </div>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-4 rounded-lg border border-[#324d67] p-6"
              >
                <h3 className="text-white text-xl font-bold">Notification Preferences</h3>
                <div className="flex flex-col gap-4">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-white text-base font-medium">Email Notifications</p>
                      <p className="text-[#92adc9] text-sm">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notificationEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, notificationEmail: e.target.checked })
                      }
                      className="w-5 h-5 rounded bg-[#192633] border-[#324d67] text-[#1172d4] focus:ring-[#1172d4]"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-white text-base font-medium">SMS Notifications</p>
                      <p className="text-[#92adc9] text-sm">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notificationSMS}
                      onChange={(e) =>
                        setSettings({ ...settings, notificationSMS: e.target.checked })
                      }
                      className="w-5 h-5 rounded bg-[#192633] border-[#324d67] text-[#1172d4] focus:ring-[#1172d4]"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-white text-base font-medium">Push Notifications</p>
                      <p className="text-[#92adc9] text-sm">Receive push notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notificationPush}
                      onChange={(e) =>
                        setSettings({ ...settings, notificationPush: e.target.checked })
                      }
                      className="w-5 h-5 rounded bg-[#192633] border-[#324d67] text-[#1172d4] focus:ring-[#1172d4]"
                    />
                  </label>
                </div>
              </motion.div>

              {/* Security Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 rounded-lg border border-[#324d67] p-6"
              >
                <h3 className="text-white text-xl font-bold">Security</h3>
                <div className="flex flex-col gap-4">
                  <Button variant="secondary" className="w-fit">
                    Change Password
                  </Button>
                  <Button variant="secondary" className="w-fit">
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              </motion.div>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button variant="secondary">Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



