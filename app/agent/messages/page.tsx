"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, TrophyIcon, ShieldCheckIcon, ListChecksIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost } from "@/app/lib/api";

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

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

const conversations = [
  {
    id: 1,
    name: "Ethan Carter",
    lastMessage: "Thank you for your interest! I'm available for a trial.",
    time: "2 hours ago",
    unread: 2,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJZtidvXFYmB-wzdqOfq4eZHjhU0wpZnNngOM3AN_ibtJ0-qb1rvQgq_Yp2KztrJmYCuCHoANvZKEZpbNWlxbYxsAYc5Qfx7WlQr3KKONKGbZnl9NUiyuHQhYOt73rxOa7B2KmvV27NnsT0twI-omuN7jQy3pXUnJvKkT_ixq15ZlSLH3GISXYsIVCPUAW1tEPwuURcRKP5hZbw4S5Gs-GbQXC886Or7WyZYPYClA9PjWxRF_Nh2G0eza26oWieofinGT3MUXY7lMy",
  },
  {
    id: 2,
    name: "Liam Harper",
    lastMessage: "When can we schedule a meeting?",
    time: "5 hours ago",
    unread: 0,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhGpr55GXbaRtaA-FUPJJ7eVY-wF6cxtkJq9Mx8Qigrz79rZ8ryuag1TocZOPdaP8bJJnRGeMOGJfsUGV1JqkCvelAH8xzeEv24zP2tP0_bbyuf6e9tuntHNGM1LTU5SRh41dmcrSvvbYxGd-3hcXojU3ZTqaZ8QR2SROyCIuyxJzkJkZXg4gGYjKVB6Bg8WWGAvsudHPTHtllTMBFAN8huHokVxIQiylJDTJa5QWpMsC5g6Qf1mWV7moUNFOp4WJKZuO1bk8AFYw1",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    lastMessage: "Here are the player reports you requested.",
    time: "1 day ago",
    unread: 1,
    avatar: "https://via.placeholder.com/150",
  },
];

export default function AgentMessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [session, selectedConversation]);

  useEffect(() => {
    if (!selectedConversation) return;
    loadConversationMessages();
  }, [selectedConversation]);

  async function loadMessages() {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    try {
      const all = await apiGet(`messages?userId=${(session.user as any).id}`);
      const map = new Map<string, any>();
      all.forEach((msg: any) => {
        const otherId = msg.fromId === (session.user as any).id ? msg.toId : msg.fromId;
        const other = msg.fromId === (session.user as any).id ? msg.to : msg.from;
        if (!map.has(otherId)) {
          map.set(otherId, {
            id: otherId,
            name: other?.name || other?.email || "Unknown",
            lastMessage: msg.content,
            time: formatTime(msg.createdAt),
            unread: 0,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(other?.name || "U")}&background=1172d4&color=fff`,
          });
        }
      });
      setConversations(Array.from(map.values()));
      if (!selectedConversation && map.size > 0) {
        setSelectedConversation(Array.from(map.values())[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadConversationMessages() {
    if (!selectedConversation || !session?.user?.id) return;
    try {
      const all = await apiGet(`messages?userId=${(session.user as any).id}`);
      const filtered = all.filter(
        (msg: any) =>
          (msg.fromId === selectedConversation && msg.toId === (session.user as any).id) ||
          (msg.toId === selectedConversation && msg.fromId === (session.user as any).id)
      );
      setMessages(filtered.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSend() {
    if (!message.trim() || !selectedConversation || !session?.user?.id) return;
    try {
      await apiPost("messages", {
        fromId: (session.user as any).id,
        toId: selectedConversation,
        content: message,
      });
      setMessage("");
      loadConversationMessages();
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#111a22] overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="ScoutHub"
            subtitle="Club"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 flex">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                  Messages
                </p>
                <p className="text-[#92adc9] text-sm font-normal leading-normal">
                  Communicate with players, agents, and scouts
                </p>
              </div>
            </div>

            <div className="flex flex-1 gap-4 p-4 min-h-0">
              {/* Conversations List */}
              <div className="flex flex-col w-80 border border-[#324d67] rounded-lg overflow-hidden">
                <div className="p-4 border-b border-[#324d67] bg-[#192633]">
                  <h3 className="text-white text-base font-bold">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-[#92adc9] text-sm">Loading...</div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-[#92adc9] text-sm">No conversations yet</div>
                  ) : (
                    conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`p-4 border-b border-[#324d67] cursor-pointer transition-colors ${
                        selectedConversation === conversation.id
                          ? "bg-[#233648]"
                          : "hover:bg-[#192633]"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex-shrink-0"
                          style={{ backgroundImage: `url("${conversation.avatar}")` }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-white text-sm font-medium truncate">
                              {conversation.name}
                            </p>
                            {conversation.unread > 0 && (
                              <span className="bg-[#1172d4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-[#92adc9] text-xs truncate">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-[#92adc9] text-xs mt-1">
                            {conversation.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col border border-[#324d67] rounded-lg overflow-hidden">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b border-[#324d67] bg-[#192633]">
                      <div className="flex items-center gap-3">
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                          style={{
                            backgroundImage: `url("${conversations.find((c) => c.id === selectedConversation)?.avatar}")`,
                          }}
                        />
                        <div>
                          <p className="text-white text-base font-bold">
                            {conversations.find((c) => c.id === selectedConversation)?.name}
                          </p>
                          <p className="text-[#92adc9] text-xs">Online</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto bg-[#111a22]">
                      <div className="flex flex-col gap-4">
                        {messages.length === 0 ? (
                          <div className="text-[#92adc9] text-sm">No messages yet. Start the conversation!</div>
                        ) : (
                          messages.map((msg: any) => {
                            const isOwn = msg.fromId === (session?.user as any)?.id;
                            return (
                              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-[70%] p-3 rounded-lg ${
                                    isOwn ? "bg-[#1172d4] text-white" : "bg-[#192633] text-white"
                                  }`}
                                >
                                  <p className="text-sm">{msg.content}</p>
                                  <p className="text-xs opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <div className="p-4 border-t border-[#324d67] bg-[#192633]">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSend()}
                          className="flex-1 bg-[#111a22] border border-[#324d67] rounded-lg px-4 py-2 text-white placeholder:text-[#92adc9] focus:outline-none focus:border-[#1172d4]"
                        />
                        <Button onClick={handleSend}>Send</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-[#92adc9]">Select a conversation to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



