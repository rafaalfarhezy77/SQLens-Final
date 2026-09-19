import {
  LayoutDashboard,
  Terminal,
  BookOpen,
  Bot,
  UserCheck,
  Radio,
  GraduationCap,
  ClipboardList,
  History,
  HelpCircle,
  Settings,
} from "lucide-react";
import { NavLink } from "@/components/client/nav-link";
import { getSession } from "@/lib/auth/session";

export async function Sidebar() {
  const session = await getSession();

  const iconMap = {
    "layout-dashboard": <LayoutDashboard size={16} />,
    terminal: <Terminal size={16} />,
    "book-open": <BookOpen size={16} />,
    bot: <Bot size={16} />,
    radio: <Radio size={16} />,
    history: <History size={16} />,
    "graduation-cap": <GraduationCap size={16} />,
    "clipboard-list": <ClipboardList size={16} />,
  };

  const navItems =
    session?.role === "dosen"
      ? [
          {
            title: "Dashboard Dosen",
            href: "/dashboard/lecturer",
            iconName: "graduation-cap" as const,
          },
          {
            title: "Materi & Latihan",
            href: "/dashboard/lecturer/materials",
            iconName: "book-open" as const,
          },
          {
            title: "Aktivitas Mahasiswa",
            href: "/dashboard/lecturer/students",
            iconName: "clipboard-list" as const,
          },
          {
            title: "Progress Mahasiswa",
            href: "/dashboard/lecturer/progress",
            iconName: "layout-dashboard" as const,
          },
          {
            title: "Monitoring IoT",
            href: "/dashboard/iot",
            iconName: "radio" as const,
          },
          {
            title: "Profil",
            href: "/dashboard/profile",
            iconName: "user" as const,
          },
        ]
      : [
          {
            title: "Dashboard",
            href: "/dashboard",
            iconName: "layout-dashboard" as const,
          },
          {
            title: "SQL Playground",
            href: "/dashboard/playground",
            iconName: "terminal" as const,
          },
          {
            title: "AI Tutor",
            href: "/dashboard/ai-tutor",
            iconName: "bot" as const,
          },
          {
            title: "Query History",
            href: "/dashboard/query-history",
            iconName: "history" as const,
          },
          {
            title: "Learning Materials",
            href: "/dashboard/learning",
            iconName: "book-open" as const,
          },
          {
            title: "Monitoring IoT",
            href: "/dashboard/iot",
            iconName: "radio" as const,
          },
          {
            title: "Profil",
            href: "/dashboard/profile",
            iconName: "user" as const,
          },
        ];

  return (
    <aside
      className="hidden lg:flex flex-col justify-between w-64 shrink-0 neo-card p-5 bg-white min-h-[720px] sticky top-28 select-none"
      aria-label="Sidebar Menu"
    >
      <div className="space-y-6">
        {/* Category Header */}
        <div>
          <span className="font-mono text-[11px] font-black tracking-wider uppercase text-[#777777] block mb-3 px-2">
            LEARNING MENU
          </span>
          <nav className="space-y-1.5 font-bold text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={
                  item.iconName === "user" ? (
                    <UserCheck size={16} />
                  ) : (
                    iconMap[item.iconName]
                  )
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Pro-Tip Box matching reference */}
        <div className="p-3.5 bg-[#F7F7F2] border-2 border-[#111111]">
          <span className="font-mono text-[10px] font-black uppercase text-[#555555] block mb-1">
            PRO-TIP
          </span>
          <p className="text-xs text-[#333333] font-medium leading-relaxed">
            Tekan{" "}
            <kbd className="font-mono bg-white px-1 border border-[#111111] text-[11px]">
              Tab
            </kbd>{" "}
            untuk navigasi cepat keyboard di seluruh halaman.
          </p>
        </div>
      </div>

      {/* Sidebar Bottom Links */}
      <div className="pt-6 border-t-2 border-[#111111] space-y-1 font-bold text-xs text-[#555555]">
        <a
          href="#help"
          className="flex items-center gap-2 p-2 hover:bg-[#F7F7F2] hover:text-[#111111] transition-colors"
        >
          <HelpCircle size={15} />
          <span>Help &amp; FAQ</span>
        </a>
        <a
          href="/dashboard/profile"
          className="flex items-center gap-2 p-2 hover:bg-[#F7F7F2] hover:text-[#111111] transition-colors"
        >
          <Settings size={15} />
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
}
