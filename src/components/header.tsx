"use client";

import DiscordIcon from "@/assets/icons/social/DiscordIcon";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Navbar } from "./navbar";
import ServerStatusBar from "./header-components/ServerStatusBar";

export default function Header() {
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const [server, setServer] = useState<Server | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    players?: { online: number; max: number };
    version?: string;
    type?: string;
  } | null>(null);
  const [discordStatus, setDiscordStatus] = useState<{
    online: number;
    invite: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    async function fetchDataMinecraft() {
      try {
        const servers = await getServers();
        if (servers && servers.length > 0) {
          const selectedServer = servers[0];
          setServer(selectedServer);

          const { ip, port } = selectedServer;
          const res = await fetch(
            `/api/status/minecraft?ip=${ip}&port=${port}`,
            { cache: "no-store" }
          );
          const data = await res.json();

          setServerStatus({
            online: data.online,
            players: data.players,
            version: data.version,
            type: data.type,
          });
        }
      } catch (error) {
        setServerStatus({ online: false });
      }
    }

    async function fetchDataDiscord() {
      try {
        if (!website?.discord?.guild_id) return;
        const res = await fetch(
          `/api/status/discord?guildId=${website?.discord.guild_id}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setDiscordStatus(data);
      } catch (error) {
        setDiscordStatus(null);
      }
    }

    fetchDataMinecraft();
    fetchDataDiscord();

    const interval1 = setInterval(fetchDataMinecraft, 60_000);
    const interval2 = setInterval(fetchDataDiscord, 60_000);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  return (
    <header id="header" className="relative bg-gradient-to-r from-blue-600 via-purple-700 to-blue-900 text-white shadow-lg overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/header-bg.webp')" }}
      />
      {/* Yumuşak geçiş efekti */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-0"
           style={{
             background: "linear-gradient(to bottom, rgba(31,41,55,0) 0%, rgba(31,41,55,0.5) 80%, rgba(31,41,55,1) 100%)",
             backdropFilter: "blur(8px)"
           }}
      />
      {/* Navbar üstte */}
      <div className="relative z-10 flex flex-col items-center pt-6 px-6">
        <div className="w-full flex justify-center mb-10">
          <div
            className="transition-all duration-500 ease-in-out bg-white/10 hover:bg-white/20 backdrop-blur shadow-none px-8 py-3 inline-flex items-center rounded-full"
            style={{
              boxShadow: "none",
              maxWidth: "unset",
              minWidth: "unset",
              borderRadius: "9999px",
            }}
          >
            <Navbar />
          </div>
        </div>
        {/* Logo ve oyuncu aktif */}
        <div className="flex flex-col items-center justify-center w-full gap-6">
          {/* Logo */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center" style={{ flex: "0 0 auto" }}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${website?.image || "/images/default-logo.png"}`}
              alt={website?.name || `Logo`}
              width={260}
              height={260}
              className="object-contain drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.25))"
              }}
              priority
            />
          </div>
          {/* Oyuncu Aktif */}
          <div>
            <span
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-lg transition-all duration-300"
              style={{ minWidth: 180 }}
            >
              <ServerStatusBar status={serverStatus} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}