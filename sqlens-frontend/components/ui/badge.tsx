import type React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "yellow"
    | "soft-yellow"
    | "white"
    | "dark"
    | "success"
    | "error"
    | "info"
    | "outline";
  children: React.ReactNode;
}

export function Badge({
  variant = "yellow",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    yellow: "bg-[#FFD600] text-[#111111]",
    "soft-yellow": "bg-[#FFF3A3] text-[#111111]",
    white: "bg-[#FFFFFF] text-[#111111]",
    dark: "bg-[#111111] text-[#FFFFFF]",
    success: "bg-[#00D084] text-[#111111]",
    error: "bg-[#FF5A5F] text-[#FFFFFF]",
    info: "bg-[#DBEAFE] text-[#111111]",
    outline: "bg-transparent text-[#111111]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider uppercase border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] select-none",
        variantStyles,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
