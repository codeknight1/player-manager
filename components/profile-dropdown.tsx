"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GearIcon, ShareIcon, QuestionMarkCircleIcon } from "@/components/icons";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProfileDropdownProps {
  avatar?: string;
  userId?: string;
  profileName?: string;
}

export function ProfileDropdown({ avatar, userId, profileName }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleSettings() {
    router.push("/player/settings");
    setIsOpen(false);
  }

  function handleHelp() {
    router.push("/player/help");
    setIsOpen(false);
  }

  function shareProfile() {
    if (!userId) {
      toast.error("Please log in");
      return;
    }
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/portfolio/${userId}`;
    setShareLink(shareUrl);
    setIsShareModalOpen(true);
    setIsOpen(false);
  }

  function handleLogout() {
    signOut({ callbackUrl: "/" });
    setIsOpen(false);
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all hover:opacity-80"
          style={{
            width: "36px",
            height: "36px",
          }}
        >
          {avatar ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url("${avatar}")` }}
            />
          ) : (
            <div className="w-full h-full bg-[#4D148C] flex items-center justify-center text-white font-bold text-sm">
              {profileName ? profileName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 z-50 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#192633] shadow-lg overflow-hidden"
              >
                <div className="py-1">
                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <GearIcon size={18} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={handleHelp}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <QuestionMarkCircleIcon size={18} />
                    <span>Help</span>
                  </button>
                  <button
                    onClick={shareProfile}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ShareIcon size={18} />
                    <span>Share</span>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Profile"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsShareModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <Input value={shareLink} readOnly className="h-10" />
            <Button
              onClick={async () => {
                if (!shareLink) return;
                try {
                  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                    await navigator.clipboard.writeText(shareLink);
                  } else {
                    const input = document.createElement("input");
                    input.value = shareLink;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand("copy");
                    document.body.removeChild(input);
                  }
                  toast.success("Link copied!");
                } catch {
                  toast.error("Unable to copy link");
                }
              }}
            >
              Copy
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "twitter", label: "Twitter" },
              { key: "linkedin", label: "LinkedIn" },
              { key: "facebook", label: "Facebook" },
              { key: "whatsapp", label: "WhatsApp" },
            ].map((platform) => (
              <Button
                key={platform.key}
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (typeof window === "undefined" || !shareLink) return;
                  const text = `Check out ${profileName || "my profile"} on TalentVerse`;
                  const encodedLink = encodeURIComponent(shareLink);
                  const encodedText = encodeURIComponent(text);
                  let targetUrl = "";
                  if (platform.key === "twitter") {
                    targetUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedText}`;
                  } else if (platform.key === "linkedin") {
                    targetUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
                  } else if (platform.key === "facebook") {
                    targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
                  } else if (platform.key === "whatsapp") {
                    targetUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedLink}`;
                  }
                  if (targetUrl) window.open(targetUrl, "_blank", "noopener,noreferrer");
                }}
              >
                {platform.label}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

