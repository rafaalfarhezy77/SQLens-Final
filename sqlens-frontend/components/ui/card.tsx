import type React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "white" | "yellow" | "soft-yellow" | "dark" | "ghost";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = "white",
  shadow = "md",
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    white: "bg-[#FFFFFF] text-[#111111] border-[#111111]",
    yellow: "bg-[#FFD600] text-[#111111] border-[#111111]",
    "soft-yellow": "bg-[#FFF3A3] text-[#111111] border-[#111111]",
    dark: "bg-[#111111] text-[#FFFFFF] border-[#111111]",
    ghost: "bg-transparent text-[#111111] border-[#111111]",
  }[variant];

  const shadowStyles = {
    none: "shadow-none",
    sm: "shadow-[2px_2px_0px_0px_#111111]",
    md: "shadow-[5px_5px_0px_0px_#111111]",
    lg: "shadow-[6px_6px_0px_0px_#111111]",
    xl: "shadow-[8px_8px_0px_0px_#111111]",
  }[shadow];

  const interactiveStyles = interactive
    ? "transition-all duration-150 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_#111111] cursor-pointer"
    : "";

  return (
    <div
      className={cn(
        "border-3",
        variantStyles,
        shadowStyles,
        interactiveStyles,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-4 md:p-6 border-b-2 border-[#111111]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-black text-lg md:text-xl uppercase tracking-tight text-[#111111]",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs md:text-sm font-medium opacity-80 mt-1 leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 md:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 md:p-6 border-t-2 border-[#111111] bg-black/5 flex items-center justify-between",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
