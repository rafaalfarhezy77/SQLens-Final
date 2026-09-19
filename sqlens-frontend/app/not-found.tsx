import Link from "next/link";
import { Compass, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F7F7F2]">
      <div className="w-full max-w-md border-3 border-[#111111] bg-[#FFFFFF] shadow-[6px_6px_0px_0px_#111111] p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FFD600] border-3 border-[#111111] shadow-[4px_4px_0px_0px_#111111]">
          <Compass size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-black/60">
            ERROR 404
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#111111]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm font-medium text-black/70">
            Rute yang Anda tuju belum terdaftar atau telah dipindahkan dalam
            arsitektur SQLens App Router.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#FFD600] text-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#111111]"
          >
            <Home size={14} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 font-bold uppercase text-xs tracking-wider border-2 border-[#111111] bg-[#FFFFFF] text-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:bg-[#F7F7F2]"
          >
            <ArrowLeft size={14} />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
