import type React from "react";
import { Badge } from "@/components/ui/badge";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?:
    | "yellow"
    | "soft-yellow"
    | "white"
    | "dark"
    | "success"
    | "outline";
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  badgeVariant = "yellow",
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b-2 border-[#111111] mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#111111]">
            {title}
          </h1>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
        {description && (
          <p className="text-sm md:text-base font-medium text-black/70">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
}
