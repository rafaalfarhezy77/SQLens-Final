export interface NavItem {
  title: string;
  href: string;
  iconName: "layout-dashboard" | "terminal" | "book-open" | "bot";
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    iconName: "layout-dashboard",
  },
  {
    title: "SQL Playground",
    href: "/dashboard/playground",
    iconName: "terminal",
    badge: "Interactive",
  },
  {
    title: "Learning",
    href: "/dashboard/learning",
    iconName: "book-open",
  },
  {
    title: "AI Tutor",
    href: "/dashboard/ai-tutor",
    iconName: "bot",
    badge: "Beta",
  },
];

export const APP_METADATA = {
  name: "SQLens",
  tagline: "Database Query Tutor",
  description:
    "Learn SQL by seeing how your queries process data step by step.",
  version: "v1.0-phase1",
};
