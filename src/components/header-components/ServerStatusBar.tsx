"use client";

import { useState, useEffect, useContext } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import Image from 'next/image';
import MinecraftIcon from '../../../public/icons/MinecraftIcon.png';
import CubeIcon from "@/assets/icons/minecraft/CubeIcon";
import { ServerIcon } from "lucide-react";

type Props = {
  status: {
    online: boolean;
    players?: { online: number; max: number };
    version?: string;
    type?: string;
  } | null;
};

export default function ServerStatusBar({ status }: Props) {
  const [isCopied, setIsCopied] = useState(false);
  const { website } = useContext(WebsiteContext);
  const serverAddress = website?.servers[0]?.ip || "SUNUCU BULUNAMADI";

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(serverAddress).catch((err) => {
    });
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return null;
}
