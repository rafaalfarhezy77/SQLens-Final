import { PageHeader } from "@/components/layout/page-header";
import { DEMO_PROGRESS } from "@/lib/features/lecturer/demo-data";
import { requireDosen } from "@/lib/auth/guards";

export default async function ProgressPage() {
  await requireDosen();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress & Hasil Mahasiswa"
        badge="MODE DEMO FRONTEND"
        description="Progress menggunakan domain aktivitas bersama, siap dipasok BFF."
      />
      <section className="grid gap-4 md:grid-cols-2">
        {DEMO_PROGRESS.map((item) => (
          <article
            key={item.id}
            className="border-2 border-[#111111] bg-white p-4 shadow-[3px_3px_0_#111111]"
          >
            <h2 className="font-black">{item.studentName}</h2>
            <p className="text-xs">Query berhasil: {item.successfulQueries}</p>
            <div className="mt-3 h-4 border-2 border-[#111111]">
              <div
                className="h-full bg-[#FFD600]"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
            <p className="mt-1 text-xs font-mono">
              {item.progressPercent}% · aktivitas terakhir{" "}
              {item.latestActivity ?? "belum ada"}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
