import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Terminal,
  CheckCircle2,
  Lightbulb,
  Play,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getModuleBySlug } from "@/lib/data/learning";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lessonModule = await getModuleBySlug(slug);

  if (!lessonModule) {
    return {
      title: "Modul Tidak Ditemukan",
      description: "Modul pembelajaran tidak terdaftar dalam kurikulum.",
    };
  }

  return {
    title: lessonModule.title,
    description: lessonModule.description,
  };
}

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lessonModule = await getModuleBySlug(slug);

  if (!lessonModule) {
    notFound();
  }

  const playgroundUrl = `/dashboard/playground?q=${encodeURIComponent(
    lessonModule.sampleQuery,
  )}`;

  return (
    <div className="space-y-8">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/learning"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#111111] hover:underline bg-white px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Kurikulum</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="soft-yellow">{lessonModule.difficulty}</Badge>
          <Badge variant="yellow">{lessonModule.id}</Badge>
        </div>
      </div>

      {/* Main Module Content Card */}
      <Card variant="white">
        <CardHeader className="bg-[#FFF3A3]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-black/60">
              <BookOpen size={14} />
              <span>DYNAMIC ROUTE: /dashboard/learning/[slug]</span>
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              {lessonModule.title}
            </CardTitle>
            <CardDescription className="text-black/80 font-medium text-sm md:text-base">
              {lessonModule.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-8">
          {/* Overview Section */}
          <div className="space-y-2">
            <h3 className="font-black text-base uppercase text-[#111111]">
              Ringkasan Konseptual
            </h3>
            <p className="text-xs md:text-sm text-black/80 leading-relaxed font-medium">
              {lessonModule.overview}
            </p>
          </div>

          {/* Key Concepts List */}
          <div className="space-y-3">
            <h3 className="font-black text-base uppercase text-[#111111] flex items-center gap-2">
              <Lightbulb size={18} className="text-[#111111]" />
              Kompetensi Kunci yang Dipelajari:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lessonModule.keyConcepts.map((concept) => (
                <div
                  key={concept}
                  className="p-3 bg-[#F7F7F2] border-2 border-[#111111] font-mono text-xs flex items-start gap-2 shadow-[2px_2px_0px_0px_#111111]"
                >
                  <CheckCircle2
                    size={16}
                    className="text-[#22c55e] shrink-0 mt-0.5"
                  />
                  <span className="font-bold text-[#111111]">{concept}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Query Playground Link Box */}
          <div className="border-2 border-[#111111] bg-[#F7F7F2] p-5 shadow-[4px_4px_0px_0px_#111111] space-y-4">
            <div className="flex items-center justify-between border-b border-[#111111] pb-2">
              <div className="flex items-center gap-2">
                <Terminal size={16} />
                <span className="font-mono text-xs font-bold uppercase">
                  Contoh Kueri Demonstrasi
                </span>
              </div>
              <Badge variant="yellow">Interactive Sandbox Ready</Badge>
            </div>

            <pre className="p-4 bg-white border-2 border-[#111111] font-mono text-xs md:text-sm text-[#111111] overflow-x-auto leading-relaxed">
              {lessonModule.sampleQuery}
            </pre>

            <p className="text-xs font-medium text-black/70">
              <strong>Penjelasan:</strong> {lessonModule.queryExplanation}
            </p>

            <div className="pt-2">
              <Button
                href={playgroundUrl}
                variant="primary"
                size="md"
                icon={<Play size={14} />}
              >
                Uji Coba Kueri Ini di SQL Playground
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
