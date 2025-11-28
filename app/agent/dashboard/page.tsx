"use client";

import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { HouseIcon, UserIcon, MagnifyingGlassIcon, ChatIcon, GearIcon, TrophyIcon, ShieldCheckIcon, ListChecksIcon } from "@/components/icons";
import { Header } from "@/components/layout/header";

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

export default function AgentDashboard() {
  const players = [
    { name: "Ethan Carter", position: "Forward, 22", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJZtidvXFYmB-wzdqOfq4eZHjhU0wpZnNngOM3AN_ibtJ0-qb1rvQgq_Yp2KztrJmYCuCHoANvZKEZpbNWlxbYxsAYc5Qfx7WlQr3KKONKGbZnl9NUiyuHQhYOt73rxOa7B2KmvV27NnsT0twI-omuN7jQy3pXUnJvKkT_ixq15ZlSLH3GISXYsIVCPUAW1tEPwuURcRKP5hZbw4S5Gs-GbQXC886Or7WyZYPYClA9PjWxRF_Nh2G0eza26oWieofinGT3MUXY7lMy" },
    { name: "Liam Harper", position: "Midfielder, 24", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhGpr55GXbaRtaA-FUPJJ7eVY-wF6cxtkJq9Mx8Qigrz79rZ8ryuag1TocZOPdaP8bJJnRGeMOGJfsUGV1JqkCvelAH8xzeEv24zP2tP0_bbyuf6e9tuntHNGM1LTU5SRh41dmcrSvvbYxGd-3hcXojU3ZTqaZ8QR2SROyCIuyxJzkJkZXg4gGYjKVB6Bg8WWGAvsudHPTHtllTMBFAN8huHokVxIQiylJDTJa5QWpMsC5g6Qf1mWV7moUNFOp4WJKZuO1bk8AFYw1" },
    { name: "Noah Bennett", position: "Defender, 21", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDxAkyYdmjiZPOzGv6SOfADK8cNtHO5jj2sBvIF5l_RYHy6fGFCXxlyiOlwbAkmgNdFvSsaJy-wfTqh2xWV10IIO9oTvSPMb3Wqa_3-ohofwrfghxAotvwlbjKbvAFUqplwwLsrRwVwczqAJVfQfqS-dC8LrZ8t5_8lCfqLf9veKoCs6GmfyL1FY11UwmM_AOQ9AdwzHu5T99dvrhGMaVu0PGwTzcGsJXWAv6-HLjPkH6QphU9En-zn2a-s-crkYkeP5XoBSMqwMeG" },
    { name: "Oliver Hayes", position: "Goalkeeper, 23", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoI5WzFOS7qKDgZUCQRptt9Jln1fo0JO7SWGjMaUVzsl9Yenc6GQCLE9YeS2j8gdSZF68x0ic-dSUP0m1uCLzxxyzw5VupaJ3RTPRgsDK4iEE82bb4wCtRzHswX4k26wm06133AcLAbskhi3wgml0OTyYrOm1jMtWh7aKQWLn9TvkxY40rbWqIz6igtWThJpC10_e_9tqU-NmS9JFNPng2Il7JvYlyXuhLW_tecV16vCAJi6x13A3qgGt9Sde6dcDOA4rPUfFH6vWb" },
    { name: "Elijah Foster", position: "Forward, 20", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLahv0Cow0eCRlzhRKhwrRe-E3eQDpIEvCXrmA1HQ4vKBciaEl47p88XUfK3cu5H8O3iKNc9qX7wwi4a9BiGXmYu7pQWAEiu5BJ6ftUuQ1w5J5pQTI8PcCu2kp_zR4qgD3ppA_r_zNFoFRLGEfYG_x2XF9Zg8eXj3ZhKeOz0ixMKx8i7Jyj7ppTzdDCZnMOs0iUeCpjD1z07ZSxW2iHj25SYiAlqrlnBhoObu-piXdDHe9OwrZp0DMVa4SFuEI7dLZjDHjpKad8Iha" },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-[#111a22] overflow-x-hidden transition-colors" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <Sidebar
            title="ScoutHub"
            subtitle="Club"
            items={sidebarItems}
          />
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-gray-600 dark:text-[#92adc9] flex border-none bg-gray-100 dark:bg-[#233648] items-center justify-center pl-4 rounded-l-lg border-r-0 transition-colors">
                    <MagnifyingGlassIcon size={24} />
                  </div>
                  <input
                    placeholder="Search for players"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-gray-100 dark:bg-[#233648] focus:border-none h-full placeholder:text-gray-500 dark:placeholder:text-[#92adc9] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal transition-colors"
                  />
                </div>
              </label>
            </div>
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Suggested Players
            </h2>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                {players.map((player, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col"
                      style={{ backgroundImage: `url("${player.avatar}")` }}
                    ></div>
                    <div>
                      <p className="text-white text-base font-medium leading-normal">
                        {player.name}
                      </p>
                      <p className="text-[#92adc9] text-sm font-normal leading-normal">
                        {player.position}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Notifications
            </h2>
            {players.slice(0, 5).map((player, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 bg-white dark:bg-[#111a22] px-4 min-h-[72px] py-2 transition-colors"
              >
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                  style={{ backgroundImage: `url("${player.avatar}")` }}
                ></div>
                <div className="flex flex-col justify-center">
                  <p className="text-white text-base font-medium leading-normal line-clamp-1">
                    {player.name}
                  </p>
                  <p className="text-[#92adc9] text-sm font-normal leading-normal line-clamp-2">
                    New player profile added
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



