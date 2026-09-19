"use client";

import { cn } from "@/lib/utils/cn";
import { usePlaygroundUiStore } from "@/lib/stores/playground-ui-store";

export interface StepNavigatorProps {
  totalSteps: number;
}

export function StepNavigator({ totalSteps }: StepNavigatorProps) {
  const activeStep = usePlaygroundUiStore(
    (state) => state.activeVisualizationStepId,
  );
  const setActiveStep = usePlaygroundUiStore(
    (state) => state.setActiveVisualizationStepId,
  );

  const handleSelect = (step: number | null) => {
    setActiveStep(step);

    if (step !== null) {
      const el = document.getElementById(`query-step-${step}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs select-none">
      <span className="text-black/60 font-bold hidden sm:inline mr-0.5 uppercase tracking-wide text-[11px]">
        Lompat ke Tahapan:
      </span>

      <button
        type="button"
        onClick={() => handleSelect(null)}
        className={cn(
          "px-3 py-1 font-bold uppercase border-2 border-[#111111] cursor-pointer transition-all text-xs",
          activeStep === null
            ? "bg-[#FFD600] text-[#111111] font-black shadow-[3px_3px_0px_0px_#111111] -translate-x-0.5 -translate-y-0.5"
            : "bg-white text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#F7F7F2] hover:-translate-x-0.5 hover:-translate-y-0.5",
        )}
      >
        Semua (All)
      </button>

      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        const labels = ["01 FROM", "02 JOIN", "03 WHERE", "04 SELECT"];
        const label = labels[i] || `0${stepNum} STEP`;

        return (
          <button
            key={stepNum}
            type="button"
            onClick={() => handleSelect(stepNum)}
            className={cn(
              "px-3 py-1 font-bold uppercase border-2 border-[#111111] cursor-pointer transition-all text-xs",
              activeStep === stepNum
                ? "bg-[#FFD600] text-[#111111] font-black shadow-[3px_3px_0px_0px_#111111] -translate-x-0.5 -translate-y-0.5"
                : "bg-white text-[#111111] shadow-[2px_2px_0px_0px_#111111] hover:bg-[#F7F7F2] hover:-translate-x-0.5 hover:-translate-y-0.5",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
