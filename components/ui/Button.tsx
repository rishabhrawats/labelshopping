"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

const variants: Record<Variant, string> = {
  primary: "bg-maroon text-[#fff8f2] hover:bg-deep-maroon active:bg-[#5a383a] focus-visible:outline-maroon",
  secondary: "border border-border bg-surface text-maroon hover:bg-[#e8d2cd] active:bg-[#dcc0ba] focus-visible:outline-gold",
  outline: "border border-maroon/35 bg-transparent text-maroon hover:bg-surface active:bg-[#e8d2cd] focus-visible:outline-maroon",
  ghost: "bg-transparent text-ink hover:bg-surface active:bg-[#e8d2cd] focus-visible:outline-maroon",
  destructive: "bg-red-700 text-white hover:bg-red-800 active:bg-red-900 focus-visible:outline-red-700",
  icon: "h-10 w-10 justify-center rounded-full border border-border bg-white text-maroon hover:bg-surface active:bg-[#e8d2cd] focus-visible:outline-maroon"
};

export function Button({
  className,
  children,
  variant = "primary",
  loading,
  disabled,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-[0.01em] transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : iconLeft}
      {loading ? "Loading..." : children}
      {!loading ? iconRight : null}
    </button>
  );
}

