"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export interface NavLinkProps {
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({
  href,
  icon,
  badge,
  children,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-3 py-2.5 font-bold text-sm border-2 border-transparent transition-all duration-100 select-none group",
        isActive
          ? "bg-[#FFD600] text-[#111111] border-[#111111] shadow-[3px_3px_0px_0px_#111111] translate-x-1"
          : "text-[#111111] hover:bg-[#FFFFFF] hover:border-[#111111] hover:shadow-[2px_2px_0px_0px_#111111] hover:translate-x-0.5",
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span
            className={cn(
              "shrink-0 transition-transform group-hover:scale-110",
              isActive ? "text-[#111111]" : "text-[#111111]/70",
            )}
          >
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>

      {badge && (
        <span
          className={cn(
            "text-[10px] font-mono px-1.5 py-0.5 border border-[#111111] font-bold uppercase",
            isActive
              ? "bg-white text-[#111111]"
              : "bg-[#FFF3A3] text-[#111111]",
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
