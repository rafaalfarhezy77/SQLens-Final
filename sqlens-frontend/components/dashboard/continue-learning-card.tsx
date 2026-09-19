import Link from "next/link";

export function ContinueLearningCard() {
  return (
    <section
      id="continue"
      className="neo-card p-6 sm:p-7 bg-[#FFF3A3] flex flex-col justify-between space-y-6"
      aria-labelledby="continue-heading"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="neo-badge neo-badge-dark text-[10px]">
            IN PROGRESS
          </span>
          <span className="font-mono text-xs font-bold text-[#666666]">
            MODUL 04
          </span>
        </div>

        <div>
          <h2
            id="continue-heading"
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#555555]"
          >
            CONTINUE LEARNING
          </h2>
          <h3 className="text-2xl font-black uppercase tracking-tight text-[#111111] mt-1">
            JOIN FUNDAMENTALS
          </h3>
          <span className="font-mono text-xs font-bold text-[#444444] block mt-0.5">
            INNER JOIN &amp; Condition Matching
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#222222] font-medium leading-relaxed">
          Pelajari bagaimana dua tabel dihubungkan menggunakan primary key dan
          foreign key, lalu lihat bagaimana JOIN mengubah hasil query.
        </p>

        <div className="p-3 bg-white border-2 border-[#111111] space-y-1.5 shadow-[2px_2px_0_#111111]">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span>3 / 5 steps completed</span>
            <span>60%</span>
          </div>
          <div className="w-full h-2.5 bg-[#F7F7F2] border border-[#111111]">
            <div className="h-full bg-[#FFD600]" style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-4 border-t-2 border-[#111111] space-y-2.5">
        <Link
          href="/dashboard/playground"
          className="neo-btn text-xs py-2.5 px-4 w-full text-center"
        >
          CONTINUE LESSON &rarr;
        </Link>
        <Link
          href="/dashboard/playground"
          className="neo-btn neo-btn-white text-xs py-2 px-4 w-full text-center"
        >
          PRACTICE QUERY
        </Link>
      </div>
    </section>
  );
}
