"use client";

import { useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { usePlaygroundUiStore } from "@/lib/stores/playground-ui-store";
import type { QueryFlowNode } from "@/lib/playground/query-graph-types";

interface QueryFlowPlaybackBarProps {
  nodes: QueryFlowNode[];
}

export function QueryFlowPlaybackBar({ nodes }: QueryFlowPlaybackBarProps) {
  const activeStepId = usePlaygroundUiStore(
    (state) => state.activeVisualizationStepId,
  );
  const setActiveStepId = usePlaygroundUiStore(
    (state) => state.setActiveVisualizationStepId,
  );
  const setSelectedNodeId = usePlaygroundUiStore(
    (state) => state.setSelectedNodeId,
  );
  const playback = usePlaygroundUiStore((state) => state.playbackState);
  const setPlayback = usePlaygroundUiStore((state) => state.setPlaybackState);

  // Find index of active node
  const activeIndex = nodes.findIndex((n) =>
    activeStepId !== null ? n.stepNumber === activeStepId : false,
  );

  const total = nodes.length;

  const goToIndex = (index: number) => {
    if (index >= 0 && index < total) {
      const node = nodes[index];
      if (node) {
        setActiveStepId(node.stepNumber);
        setSelectedNodeId(node.id);
      }
    }
  };

  const handleFirst = () => goToIndex(0);
  const handlePrev = () => {
    if (activeIndex <= 0) goToIndex(total - 1);
    else goToIndex(activeIndex - 1);
  };
  const handleNext = () => {
    if (activeIndex === -1 || activeIndex >= total - 1) goToIndex(0);
    else goToIndex(activeIndex + 1);
  };
  const handleLast = () => goToIndex(total - 1);

  const togglePlay = () => {
    setPlayback({ isPlaying: !playback.isPlaying });
  };

  // Auto-advance timer when playing
  useEffect(() => {
    if (!playback.isPlaying || total === 0) return;

    const timer = setInterval(() => {
      const currentIdx = nodes.findIndex(
        (n) =>
          n.stepNumber ===
          usePlaygroundUiStore.getState().activeVisualizationStepId,
      );
      if (currentIdx === -1 || currentIdx >= total - 1) {
        // Loop back to start
        const first = nodes[0];
        if (first) {
          setActiveStepId(first.stepNumber);
          setSelectedNodeId(first.id);
        }
      } else {
        const next = nodes[currentIdx + 1];
        if (next) {
          setActiveStepId(next.stepNumber);
          setSelectedNodeId(next.id);
        }
      }
    }, playback.speedMs);

    return () => clearInterval(timer);
  }, [
    playback.isPlaying,
    playback.speedMs,
    total,
    nodes,
    setActiveStepId,
    setSelectedNodeId,
  ]);

  const activeNode = activeIndex >= 0 ? nodes[activeIndex] : null;

  return (
    <div className="bg-[#222222] text-white border-2 border-[#111111] p-3 shadow-[3px_3px_0px_0px_#111111] flex flex-wrap items-center justify-between gap-3">
      {/* Playback Transport Buttons */}
      <div className="flex items-center gap-1.5 font-mono">
        <button
          type="button"
          onClick={handleFirst}
          title="Langkah Pertama (Home)"
          className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white border border-[#555555] active:translate-y-0.5 cursor-pointer transition-colors"
        >
          <SkipBack size={15} />
        </button>

        <button
          type="button"
          onClick={handlePrev}
          title="Langkah Sebelumnya (Previous)"
          className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white border border-[#555555] active:translate-y-0.5 cursor-pointer transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          title={
            playback.isPlaying ? "Jeda Simulasi" : "Jalankan Simulasi (Play)"
          }
          className="px-3 py-1.5 bg-[#FFD600] text-[#111111] font-black text-xs uppercase flex items-center gap-1.5 border border-[#111111] shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
        >
          {playback.isPlaying ? (
            <>
              <Pause size={14} className="fill-[#111111]" />
              <span>PAUSE</span>
            </>
          ) : (
            <>
              <Play size={14} className="fill-[#111111]" />
              <span>PLAY</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleNext}
          title="Langkah Selanjutnya (Next)"
          className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white border border-[#555555] active:translate-y-0.5 cursor-pointer transition-colors"
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={handleLast}
          title="Langkah Terakhir (End)"
          className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white border border-[#555555] active:translate-y-0.5 cursor-pointer transition-colors"
        >
          <SkipForward size={15} />
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveStepId(null);
            setSelectedNodeId(null);
            setPlayback({ isPlaying: false });
          }}
          title="Tampilkan Semua Node"
          className="px-2 py-1 text-[11px] bg-[#333333] hover:bg-[#444444] text-white/90 border border-[#555555] active:translate-y-0.5 cursor-pointer ml-1"
        >
          <RotateCcw size={12} className="inline mr-1" />
          Reset
        </button>
      </div>

      {/* Active Stage Indicator */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-white/60 font-semibold hidden sm:inline">
          STATUS:
        </span>
        {activeNode ? (
          <div className="flex items-center gap-2 bg-[#111111] px-2.5 py-1 border border-[#FFD600]">
            <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse" />
            <span className="text-[#FFD600] font-black uppercase">
              Step {activeIndex + 1}/{total}:
            </span>
            <span className="text-white font-bold truncate max-w-[200px]">
              {activeNode.type}
            </span>
            <span className="text-white/60 text-[11px] hidden md:inline">
              ({activeNode.outputRowCount} baris)
            </span>
          </div>
        ) : (
          <span className="text-white/70 italic text-[11px]">
            Semua tahapan aktif (Klik node untuk inspeksi)
          </span>
        )}
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1 font-mono text-[11px]">
        <span className="text-white/50 font-bold mr-1 hidden lg:inline">
          Kecepatan:
        </span>
        {[
          { label: "1x", ms: 2000 },
          { label: "1.5x", ms: 1400 },
          { label: "2x", ms: 800 },
        ].map((spd) => (
          <button
            key={spd.label}
            type="button"
            onClick={() => setPlayback({ speedMs: spd.ms })}
            className={`px-2 py-0.5 border cursor-pointer ${
              playback.speedMs === spd.ms
                ? "bg-[#FFD600] text-[#111111] font-black border-[#FFD600]"
                : "bg-[#333333] text-white/70 border-[#555555] hover:text-white"
            }`}
          >
            {spd.label}
          </button>
        ))}
      </div>
    </div>
  );
}
