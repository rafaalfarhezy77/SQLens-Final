"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, ShoppingBag, BookOpen, Users, FolderGit2 } from "lucide-react";
import type { StudyCaseSummary } from "@/lib/api/contracts/study-cases";
import type { SharedDataset } from "@/lib/api/contracts/shared-datasets";

interface CaseStudySelectorProps {
  studyCases: StudyCaseSummary[];
  sharedDatasets?: SharedDataset[];
  hasCustomDataset?: boolean;
  activeCaseId: string;
}

export function CaseStudySelector({
  studyCases,
  sharedDatasets = [],
  hasCustomDataset = false,
  activeCaseId,
}: CaseStudySelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectCase = (caseId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("case", caseId);
    params.delete("shared");
    params.delete("q"); // reset query to default for new study case
    router.push(`/dashboard/playground?${params.toString()}`);
  };

  const handleSelectShared = (sharedId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("shared", sharedId);
    params.delete("case");
    params.delete("q");
    router.push(`/dashboard/playground?${params.toString()}`);
  };

  const activeSharedId = searchParams.get("shared");
  const isCustomMode = searchParams.get("custom") === "1";

  const getIcon = (id: string) => {
    switch (id) {
      case "academic":
        return <GraduationCap className="w-4 h-4" />;
      case "ecommerce":
        return <ShoppingBag className="w-4 h-4" />;
      case "library":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <FolderGit2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-2">
          <span>PILIH STUDI KASUS & DATABASE</span>
        </label>
        <span className="text-[11px] font-mono font-bold text-[#666666]">
          {studyCases.length} Kasus Bawaan {sharedDatasets.length > 0 ? `• ${sharedDatasets.length} Dataset Dosen` : ""}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {studyCases.map((cs) => {
          const isActive = !activeSharedId && !isCustomMode && activeCaseId === cs.id;
          return (
            <button
              key={cs.id}
              type="button"
              onClick={() => handleSelectCase(cs.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-black uppercase transition-all border-2 border-[#111111] shadow-[2px_2px_0_#111111] active:translate-x-[1px] active:translate-y-[1px] ${
                isActive
                  ? "bg-[#FFD600] text-[#111111] scale-[1.02]"
                  : "bg-white hover:bg-[#F7F7F2] text-[#333333]"
              }`}
            >
              {getIcon(cs.id)}
              <span>{cs.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 border border-[#111111] ${
                  isActive ? "bg-white" : "bg-[#FFF3A3]"
                }`}
              >
                {cs.difficulty}
              </span>
            </button>
          );
        })}

        {sharedDatasets.map((sd) => {
          const isActive = activeSharedId === sd.id;
          return (
            <button
              key={sd.id}
              type="button"
              onClick={() => handleSelectShared(sd.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-black uppercase transition-all border-2 border-[#111111] shadow-[2px_2px_0_#111111] active:translate-x-[1px] active:translate-y-[1px] ${
                isActive
                  ? "bg-[#00D084] text-[#111111] scale-[1.02]"
                  : "bg-white hover:bg-[#E8F8F0] text-[#333333]"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{sd.title}</span>
              <span className="text-[10px] px-1.5 py-0.2 border border-[#111111] bg-white">
                Dosen
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
