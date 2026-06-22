import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm placeholder:text-muted", props.className)} />;
}

