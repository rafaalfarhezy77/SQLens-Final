import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TopicsToReview() {
  const topics = [
    {
      title: "JOIN CONDITION MISMATCH",
      desc: "Tinjau kecocokan kolom primary key dan foreign key agar tidak menghasilkan row duplikat.",
      href: "/dashboard/playground?q=SELECT+*+FROM+students+JOIN+scores+ON+students.id+=+scores.student_id;",
    },
    {
      title: "WHERE VS HAVING CLAUSE",
      desc: "Kondisi filter fungsi agregat (COUNT, AVG) harus diletakkan pada HAVING, bukan WHERE.",
      href: "/dashboard/ai-tutor?prompt=Jelaskan+perbedaan+WHERE+dan+HAVING",
    },
  ];

  return (
    <aside
      className="neo-card p-6 sm:p-7 bg-[#F7F7F2] space-y-4"
      aria-labelledby="review-aside-heading"
    >
      <div className="pb-3 border-b-2 border-[#111111]">
        <span className="neo-badge neo-badge-red text-[10px] mb-2">
          NEEDS ATTENTION
        </span>
        <h2
          id="review-aside-heading"
          className="text-2xl font-black uppercase tracking-tight text-[#111111]"
        >
          TOPICS TO REVIEW
        </h2>
        <p className="text-xs text-[#555555] font-medium">
          Konsep yang disarankan untuk ditinjau kembali.
        </p>
      </div>

      <div className="space-y-3.5 pt-1">
        {topics.map((t) => (
          <div
            key={t.title}
            className="p-4 bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] space-y-2 hover:shadow-[3px_3px_0_#111111] transition-shadow"
          >
            <h3 className="font-mono text-xs font-black uppercase text-[#111111]">
              {t.title}
            </h3>
            <p className="text-xs text-[#444444] font-medium leading-relaxed">
              {t.desc}
            </p>
            <Link
              href={t.href}
              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold underline hover:bg-[#FFF3A3] p-0.5"
            >
              <span>Pelajari Konsep</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}
