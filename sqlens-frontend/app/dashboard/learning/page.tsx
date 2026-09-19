import type { Metadata } from "next";
import Link from "next/link";
import { Award, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllModules } from "@/lib/data/learning";

export const metadata: Metadata = {
  title: "Materi & Modul Pembelajaran",
  description:
    "Kurikulum terstruktur belajar basis data relasional langkah demi langkah.",
};

export default async function LearningPage() {
  const modules = await getAllModules();
  const completedCount = modules.filter((m) => m.status === "Selesai").length;
  const totalPercent = Math.round((completedCount / modules.length) * 100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Modul Pembelajaran SQL"
        badge="KURIKULUM RESMI"
        description="Jalur belajar terstruktur untuk menguasai basis data relasional dari proyeksi dasar hingga nested subquery."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="yellow">Semester 3 Gasal</Badge>
          </div>
        }
      />

      {/* Progress Summary Card */}
      <div className="border-3 border-[#111111] bg-[#FFFFFF] p-6 shadow-[6px_6px_0px_0px_#111111] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-[#FFD600]" />
            <span className="font-mono text-xs font-bold uppercase text-black/60">
              Pencapaian Kurikulum Mahasiswa
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase text-[#111111]">
            {completedCount} dari {modules.length} Modul Selesai Dipelajari
          </h2>
          <p className="text-xs md:text-sm font-medium text-black/70">
            Pilih modul untuk mempelajari konsep kunci dan uji coba kueri
            langsung di playground.
          </p>
        </div>

        <div className="w-full md:w-64 space-y-2 shrink-0">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span>Progress Total</span>
            <span>{totalPercent}%</span>
          </div>
          <div className="w-full bg-[#F7F7F2] border-2 border-[#111111] h-4 p-0.5 shadow-[2px_2px_0px_0px_#111111]">
            <div
              className="bg-[#FFD600] h-full transition-all duration-300"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module List Grid */}
      <div className="space-y-4">
        {modules.map((m) => (
          <Card key={m.id} variant="white" interactive>
            <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-black/60 bg-[#F7F7F2] px-2 py-0.5 border border-[#111111]">
                    {m.id}
                  </span>
                  <Badge
                    variant={
                      m.status === "Selesai"
                        ? "success"
                        : m.status === "Sedang Berjalan"
                          ? "yellow"
                          : "outline"
                    }
                  >
                    {m.status}
                  </Badge>
                  <Badge variant="soft-yellow">{m.difficulty}</Badge>
                </div>

                <h3 className="font-black text-lg uppercase tracking-tight text-[#111111]">
                  <Link
                    href={`/dashboard/learning/${m.slug}`}
                    className="hover:underline hover:text-[#FFD600]"
                  >
                    {m.title}
                  </Link>
                </h3>

                <p className="text-xs md:text-sm font-medium text-black/70 max-w-3xl">
                  {m.description}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0">
                <div className="hidden lg:block text-right font-mono text-xs">
                  <span className="block text-black/40">KEMAJUAN</span>
                  <strong>{m.progressPercent}%</strong>
                </div>

                <Button
                  href={`/dashboard/learning/${m.slug}`}
                  variant={
                    m.status === "Sedang Berjalan" ? "primary" : "secondary"
                  }
                  size="sm"
                  icon={<ArrowRight size={14} />}
                >
                  Buka Materi
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
