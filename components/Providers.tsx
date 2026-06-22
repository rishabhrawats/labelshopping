"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider basePath={siteConfig.basePath ? `${siteConfig.basePath}/api/auth` : "/api/auth"}>{children}</SessionProvider>;
}
