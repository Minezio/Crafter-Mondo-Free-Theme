"use client";

import { useContext, useState, useEffect } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { TopBar } from "@/components/top-bar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { usePathname } from "next/navigation";
import InnovativeSignups from "@/components/widgets/InnovativeSignups";
import { useStatisticsService } from "@/lib/services/statistics.service";

// Bu bileşen, provider'lar ile sayfalarınız arasında bir köprü görevi görecek.
export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const { getStatistics } = useStatisticsService();
  const [server, setServer] = useState<Server | null>(null);
  const [latestSignups, setLatestSignups] = useState<any[]>([]);
  const [isSignupsLoading, setIsSignupsLoading] = useState(true);

  useEffect(() => {
    getServers().then((servers) => {
      if (servers && servers.length > 0) {
        setServer(servers[0]);
      }
    });
    // Fetch latest signups
    getStatistics().then((stats) => {
      setLatestSignups(stats?.latest?.signups || []);
      setIsSignupsLoading(false);
    }).catch(() => setIsSignupsLoading(false));
  }, []);

  if (pathname.includes('auth')) {
    return (children);
  }

  return (
    <>
      <TopBar broadcastItems={website?.broadcast_items} />
      <Header />
      {/* Sayfa içeriği (örneğin Home component'i) buraya gelecek */}
      <main>{children}</main>
      {/* Son Kayıt Olanlar - Footer'ın hemen üstünde */}
      {!isSignupsLoading && latestSignups && latestSignups.length > 0 && (
        <InnovativeSignups signups={latestSignups} />
      )}
      <Footer server={server} />
      {/* BURAYI SİLİN */}
      {/* <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 z-20"
           style={{
             background: "linear-gradient(to bottom, rgba(31,41,55,0) 0%, rgba(31,41,55,0.5) 80%, rgba(31,41,55,1) 100%)",
             backdropFilter: "blur(8px)"
           }}
      /> */}
    </>
  );
}