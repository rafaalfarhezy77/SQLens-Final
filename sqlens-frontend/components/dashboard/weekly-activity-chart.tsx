export function WeeklyActivityChart() {
  const days = [
    { day: "Mon", count: 3, height: "35%" },
    { day: "Tue", count: 5, height: "60%" },
    { day: "Wed", count: 2, height: "25%" },
    { day: "Thu", count: 4, height: "50%" },
    { day: "Fri", count: 7, height: "85%", active: true },
    { day: "Sat", count: 2, height: "25%" },
    { day: "Sun", count: 1, height: "15%" },
  ];

  return (
    <section
      className="neo-card p-6 sm:p-7 bg-white space-y-6"
      aria-labelledby="activity-heading"
    >
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]">
        <div>
          <h2
            id="activity-heading"
            className="text-2xl font-black uppercase tracking-tight text-[#111111]"
          >
            WEEKLY ACTIVITY
          </h2>
          <p className="text-xs text-[#555555] font-medium">
            Frekuensi query yang kamu eksekusi sepanjang minggu ini.
          </p>
        </div>
        <span className="font-mono text-xs font-bold bg-[#FFF3A3] border border-[#111111] px-2 py-0.5 shadow-[1px_1px_0_#111111]">
          24 Total Queries
        </span>
      </div>

      {/* HTML5 + CSS Bar Chart Representation matching reference */}
      <div className="flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 h-48 border-b-2 border-[#111111]">
        {days.map((item) => (
          <div
            key={item.day}
            className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group"
          >
            <span className="font-mono text-[10px] font-bold text-[#777777] opacity-0 group-hover:opacity-100 transition-opacity">
              {item.count}
            </span>
            <div
              className={`w-full border-2 border-[#111111] transition-all ${
                item.active
                  ? "bg-[#FFD600] shadow-[2px_2px_0_#111111]"
                  : "bg-[#FFF3A3] hover:bg-[#FFD600]"
              }`}
              style={{ height: item.height }}
            />
            <span className="font-mono text-[11px] font-bold text-[#111111] pt-1">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-[#F7F7F2] border-2 border-[#111111] text-xs font-mono text-[#555555] flex items-center justify-between shadow-[2px_2px_0_#111111]">
        <span>
          Hari paling aktif: <strong>Friday (7 queries)</strong>
        </span>
        <span className="text-[#00D084] font-bold">&bull; Consistent</span>
      </div>
    </section>
  );
}
