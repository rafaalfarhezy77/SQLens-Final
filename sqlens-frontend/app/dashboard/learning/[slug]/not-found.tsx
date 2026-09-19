import Link from "next/link";
import { BookX, ArrowLeft, BookOpen } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LessonNotFound() {
  return (
    <div className="py-8 max-w-xl mx-auto space-y-4">
      <Card variant="white" shadow="lg">
        <CardHeader className="bg-[#FFF3A3]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#111111] text-white flex items-center justify-center font-bold">
                <BookX size={18} />
              </div>
              <CardTitle className="text-base">Modul Tidak Ditemukan</CardTitle>
            </div>
            <Badge variant="error">404 NOT FOUND</Badge>
          </div>
          <CardDescription className="text-black/80 font-medium">
            Slug materi pembelajaran yang Anda minta tidak terdaftar dalam
            kurikulum SQLens.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 p-6">
          <p className="text-xs font-mono text-black/70 bg-[#F7F7F2] p-3 border-2 border-[#111111]">
            Silakan periksa kembali URL modul atau pilih materi yang tersedia
            pada indeks kurikulum resmi.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard/learning"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#FFD600] text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar Modul</span>
          </Link>

          <Link
            href="/dashboard/playground"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-white text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#F7F7F2]"
          >
            <BookOpen size={14} />
            <span>Buka SQL Playground</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
