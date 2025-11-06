"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { MagnifyingGlassIcon, ChatIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const conversations = [
  {
    name: "Alex Morgan",
    status: "Active 2m ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiRF-nzH6uY3njqdxwmK344VK25MeJdHL64SM3-7owbcsoSGpxMLY15ngPNxFPumImsqOIdUoLJ4PWPXS7-QHvcKh2hZSPhzjzYBsQC_F7bRmIeaYA9VIFsbwQSRHcjak6uy1_22IBumcyjG_wj8qsvuZFONycsNLqnxm-U5zv6_dgOWhTfOV9ysYa5MnzuwGUcgI8oXh0zebiCMw-cwoK3GODpzci-CxkQZjico0XU45F9zKY2CXVxv2B5q1haQxCQe9cYTXX1J4_",
  },
  {
    name: "FC Barcelona",
    status: "Active 1h ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCosM_sMNZ3PW6rgilp0vNKvYYweORIsh8nxy63RY0gIVjQpBHyfTvYTR_jkHi-oCKH4ssegDz9l7MIBb5qLNPomyRw4Bg2B497lgDOGqOPmk52XK0ghfiKkaUEDEfLqKdGmbDrR_3-C2gRKrsiYfN4CW-rYlmkpq2umE3S8nUyDJejdmeAamdJPqzuHeRNxX9_JBYtNtIkV_Zzza6RW_mnps1HlqOWveA4712VdV8i82a5fJiIPToFJIeoOwh6S3tq5tdRc2TWwZo",
  },
  {
    name: "Elite Sports Agency",
    status: "Active 30m ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuArsxZuAN2HY0xCvkexIqzPrIzhGT74o8siOpubRtW7C_TN0xVLL9TImvdy_ewnpeti0i7qdI03gODADB7fZ52e6v0m3UBq9AuWez5M8ojKpAWtuGVRMEx_PpN57WMUfvPdrf_Gmurc85ahnVPDubmu0gNQo23oGmrK3gEB6-xTdTP6VFVYI4OnRofxoVF7dY9ajlm0JHYBUxkg5AfqsSx680dnQItw9IbM1e6biAKe2oilGRMI77sJZbuhBMH3M9Dxpy1RrWQb2EZD",
  },
  {
    name: "Global Football Academy",
    status: "Active 5m ago",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDD21Jt8QMKn9G_2ouDiBXXB_uVSIBlPdCXLJUQg2RpDYZOHL5OXN4AVIKt2hZOK2AmoWCCWRBizeALTMkekG-mVCiXVWGfM1REdTox0nQ9XPx33Xu_JYuSiVYcO1p8TVEdXw0WyAPDxYd-cvur2GbEDLF1l7oRVU8OI7wYj_id3A1muuN9BCfHq9YMf6Deye-uJe3IX180nT_V33A9-JxGp3NjMoESZzYblI7aIls9fXsZf0N05Pvo3gsv_PlM9wlsZP3wpWbOmRb2",
  },
];

const messages = [
  {
    sender: "Alex Morgan",
    text: "Hi Sarah, I'm interested in exploring opportunities with your club. Can we schedule a call to discuss further?",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCMz49TnLvKMg70VBcYg1M-ZqTikHN8lDKHPLeL50IFMAOHnLdcWSpRvZ_fAeyBgyj8hCNWzXm2sJK-DZL4-T2jPf47KM8dGEy7FJmu7BH6qHHkXwmUrxhUBO2A90kHWPTfBU5FNeQADK7eIhFrhfMeMl5-mHRN7G6a1dTHG1hovfrxe_ODYZ1yqz8o5CAaCYtqVGFwi4WRVtBaP9YLQXmedEUArGLHuhxNeajpMYSDyQQddGH3o7aNKpddM_ibVnPTyR6KC1XQ1oL",
    isMe: false,
  },
  {
    sender: "Sarah",
    text: "Hi Alex, thanks for reaching out! I'm excited to hear about your interest. Yes, let's set up a call. How about tomorrow at 3 PM EST?",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJZUAH_aTPK0eccK7ptMUFmVt_FhwNPT_uFLXH_t83LW46SSsx1BZ7Q_sE51Q9FiEQcPhjxc8ffbPJxPj8VKDXll-nK2_X-zszzCMVbAOX2t5sC3KkHqA6rD3e9Pr8z4aIPXwbVHLByOFJBHX8cWlYG_VNudijaJGbgl7W_SiOlDjM52iJFx6yglWJlHItwBAghpedr7FY1P0eYu-IRFjmcUsNibxUOFd6y4_OGNjZlxvgWaUGyAKRhZ2l3cJm-y8975hCkScSmgnb",
    isMe: true,
  },
  {
    sender: "Alex Morgan",
    text: "That works perfectly for me. Looking forward to our conversation!",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeoebLMnyZH3aOENHG8PETlkSV_U0gie1HFUZ0ZowCo7WuJ2aDnyNdbNO8PVtZY9qmi7dSY4cVN2Sse00kVtVrF8DcfOpyB-mzee3Mxoc4eUB-xO26Cj_MfkGN74o3PPNHyH-GcmUOj30SAFm-v6EJaqNPhQT8hOt-dGiStkbZ72HhlxaNy86Pt9BF2ECnW8jmwmEHS3la3sg-TJ-_g1HqgUBeYKj4C_0QzqQglC8k3-Z3aV1ZYnuY5NcLGjNnUYWoblQKpIHVmgmk",
    isMe: false,
  },
];

export default function MessagingPage() {
  const [message, setMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success("Message sent!");
    setMessage("");
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#111a22] p-4">
              <div className="flex flex-col gap-4">
                <div className="px-4 py-3">
                  <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                      <div className="text-[#92adc9] flex border-none bg-[#233648] items-center justify-center pl-4 rounded-l-lg border-r-0">
                        <MagnifyingGlassIcon size={24} />
                      </div>
                      <input
                        placeholder="Search"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#233648] focus:border-none h-full placeholder:text-[#92adc9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                      />
                    </div>
                  </label>
                </div>
                <div className="flex flex-col gap-2">
                  {conversations.map((conv, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedConversation(conv)}
                      className={`flex items-center gap-4 bg-[#111a22] px-4 min-h-[72px] py-2 cursor-pointer hover:bg-[#192633] transition-colors ${
                        selectedConversation.name === conv.name ? "bg-[#192633]" : ""
                      }`}
                    >
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                        style={{ backgroundImage: `url("${conv.avatar}")` }}
                      ></div>
                      <div className="flex flex-col justify-center">
                        <p className="text-white text-base font-medium leading-normal line-clamp-1">
                          {conv.name}
                        </p>
                        <p className="text-[#92adc9] text-sm font-normal leading-normal line-clamp-2">
                          {conv.status}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              {selectedConversation.name}
            </h2>
            <div className="flex-1 overflow-y-auto px-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-end gap-3 p-4 ${msg.isMe ? "justify-end" : ""}`}
                >
                  {!msg.isMe && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{ backgroundImage: `url("${msg.avatar}")` }}
                    ></div>
                  )}
                  <div className={`flex flex-1 flex-col gap-1 ${msg.isMe ? "items-end" : "items-start"}`}>
                    <p className={`text-[#92adc9] text-[13px] font-normal leading-normal max-w-[360px] ${msg.isMe ? "text-right" : ""}`}>
                      {msg.sender}
                    </p>
                    <p
                      className={`text-base font-normal leading-normal flex max-w-[360px] rounded-lg px-4 py-3 ${
                        msg.isMe ? "bg-[#1172d4] text-white" : "bg-[#233648] text-white"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                  {msg.isMe && (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{ backgroundImage: `url("${msg.avatar}")` }}
                    ></div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex items-center px-4 py-3 gap-3">
              <label className="flex flex-col min-w-40 h-12 flex-1">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <input
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#233648] focus:border-none h-full placeholder:text-[#92adc9] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                  />
                  <div className="flex border-none bg-[#233648] items-center justify-center pr-4 rounded-r-lg border-l-0 !pr-2">
                    <div className="flex items-center gap-4 justify-end">
                      <div className="flex items-center gap-1">
                        <button className="flex items-center justify-center p-1.5 hover:bg-[#324d67] rounded transition-colors">
                          <div className="text-[#92adc9]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
                            </svg>
                          </div>
                        </button>
                        <button className="flex items-center justify-center p-1.5 hover:bg-[#324d67] rounded transition-colors">
                          <div className="text-[#92adc9]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z" />
                            </svg>
                          </div>
                        </button>
                      </div>
                      <Button
                        onClick={handleSend}
                        size="sm"
                        className="hidden @[480px]:block"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



