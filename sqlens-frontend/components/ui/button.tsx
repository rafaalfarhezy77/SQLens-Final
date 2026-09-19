import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs md:text-sm select-none cursor-pointer border-3 border-[#111111] transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:transform-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs shadow-[2px_2px_0px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:hover:shadow-[2px_2px_0px_0px_#111111]",
    md: "px-5 py-2.5 shadow-[4px_4px_0px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:hover:shadow-[4px_4px_0px_0px_#111111]",
    lg: "px-6 py-3.5 text-sm md:text-base shadow-[5px_5px_0px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:hover:shadow-[5px_5px_0px_0px_#111111]",
  }[size];

  const variantStyles = {
    primary: "bg-[#FFD600] text-[#111111] hover:bg-[#ffe033]",
    secondary: "bg-[#FFFFFF] text-[#111111] hover:bg-[#F0F0EA]",
    dark: "bg-[#111111] text-[#FFFFFF] shadow-[4px_4px_0px_0px_#FFD600] hover:bg-[#262626] hover:shadow-[2px_2px_0px_0px_#FFD600] active:shadow-none",
    outline: "bg-transparent text-[#111111] hover:bg-[#FFFFFF]",
    ghost:
      "bg-transparent border-transparent shadow-none hover:bg-black/5 hover:border-[#111111] hover:shadow-[2px_2px_0px_0px_#111111] disabled:hover:border-transparent disabled:hover:shadow-none",
  }[variant];

  const combinedClasses = cn(baseStyles, sizeStyles, variantStyles, className);

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
