"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { withBasePath } from "@/lib/site";

export function AccountLogoutButton() {
  return <Button variant="outline" onClick={() => signOut({ callbackUrl: withBasePath("/") })}>Logout</Button>;
}
