"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  Send,
  HelpCircle,
  Loader2,
  Sparkles,
  X,
  Lightbulb,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type HelpMode = "explain" | "hint" | "error";

interface PresetGroup {
  mode: HelpMode;
  label: string;
  icon: typeof Sparkles;
  prompts: string[];
}

const PRESET_GROUPS: PresetGroup[] = [
  {
    mode: "explain",
    label: "Explain Query",
    icon: Sparkles,
    prompts: [
      "Jelaskan urutan logika eksekusi query SQL (Query Execution Order).",
      "Bagaimana cara kerja INNER JOIN antara tabel students dan scores?",
    ],
  },
  {
    mode: "hint",
    label: "Give Hint",
    icon: Lightbulb,
    prompts: [
      "Mengapa Citra Dewi tidak muncul pada tabel hasil akhir query?",
      "Kapan saya harus menggunakan HAVING daripada WHERE?",
    ],
  },
  {
    mode: "error",
    label: "Explain Error",
    icon: AlertTriangle,
    prompts: [
      "Mengapa fungsi agregat COUNT(*) tidak dapat ditaruh langsung di klausa WHERE?",
      "Apa penyebab umum kegagalan join condition ON students.id = scores.student_id?",
    ],
  },
];

export function AiQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPrompt = searchParams.get("prompt") || "";

  const [activeMode, setActiveMode] = useState<HelpMode>("explain");
  const [question, setQuestion] = useState(currentPrompt);
  const [isPending, startTransition] = useTransition();

  const handleAsk = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText !== undefined ? customText : question;
    if (!textToSend.trim()) return;

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("prompt", textToSend);
      router.push(`/dashboard/ai-tutor?${params.toString()}`);
    });
  };

  const handleSelectPreset = (promptText: string) => {
    setQuestion(promptText);
    handleAsk(undefined, promptText);
  };

  const activeGroup =
    PRESET_GROUPS.find((g) => g.mode === activeMode) ??
    (PRESET_GROUPS[0] as PresetGroup);

  return (
    <div className="neo-card p-5 sm:p-6 bg-white space-y-4">
      {/* Header with Back to Topics Link */}
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#111111] text-white flex items-center justify-center font-bold text-xs shadow-[1px_1px_0_#111111]">
            <Bot size={15} />
          </div>
          <span className="font-mono text-xs font-black uppercase tracking-wider text-[#111111]">
            KONSULTASI AI TUTOR
          </span>
        </div>
        <Link
          href="/dashboard/ai-tutor"
          className="text-[10px] font-mono font-bold bg-[#F7F7F2] hover:bg-[#FFF3A3] text-[#111111] border border-[#111111] px-2 py-1 flex items-center gap-1 transition-colors"
          title="Kembali ke halaman panduan & skenario awal"
        >
          <ArrowLeft size={11} />
          <span>Ganti Topik</span>
        </Link>
      </div>

      {/* Segmented Help Modes Bar */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-black uppercase text-[#666666] tracking-wider block">
          MODE BANTUAN TUTOR:
        </span>
        <fieldset
          className="grid grid-cols-3 gap-1.5 p-1 bg-[#F7F7F2] border-2 border-[#111111] m-0"
          aria-label="Mode Bantuan AI Tutor"
        >
          {PRESET_GROUPS.map((group) => {
            const isSelected = activeMode === group.mode;
            const Icon = group.icon;
            return (
              <button
                key={group.mode}
                type="button"
                onClick={() => setActiveMode(group.mode)}
                className={cn(
                  "py-1.5 px-2 text-[11px] font-mono font-bold uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer",
                  isSelected
                    ? "bg-[#FFD600] border-2 border-[#111111] shadow-[2px_2px_0_#111111] text-[#111111] font-black"
                    : "bg-transparent text-[#666666] hover:text-[#111111] hover:bg-white/60",
                )}
              >
                <Icon size={12} className="shrink-0" />
                <span className="truncate">{group.label}</span>
              </button>
            );
          })}
        </fieldset>
      </div>

      {/* Preset Questions for Active Mode */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono font-bold text-[#666666] flex items-center gap-1.5 uppercase tracking-wide">
          <HelpCircle size={13} className="text-[#111111]" /> Pertanyaan
          Analisis Populer:
        </span>
        <div className="space-y-2">
          {activeGroup.prompts.map((prompt) => {
            const isSelected = question.trim() === prompt.trim();
            return (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSelectPreset(prompt)}
                className={cn(
                  "w-full text-left p-3 border-2 border-[#111111] font-mono text-xs font-bold transition-all block cursor-pointer",
                  isSelected
                    ? "bg-[#FFD600] text-[#111111] shadow-[3px_3px_0px_0px_#111111] -translate-x-0.5"
                    : "bg-[#F7F7F2] text-[#111111] hover:bg-[#FFF3A3] shadow-[2px_2px_0px_0px_#111111] active:translate-x-0.5 active:translate-y-0.5",
                )}
              >
                &ldquo;{prompt}&rdquo;
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => handleAsk(e)} className="space-y-2.5 pt-1">
        <div className="relative border-2 border-[#111111] bg-[#F7F7F2] focus-within:bg-white focus-within:shadow-[3px_3px_0_#111111] shadow-[2px_2px_0_#111111] transition-all p-2.5">
          <label htmlFor="ai-question" className="sr-only">
            Pertanyaan ke AI Tutor
          </label>
          <textarea
            id="ai-question"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Tanyakan konsep query, urutan evaluasi, atau tempelkan cuplikan query SQL di sini..."
            className="w-full font-mono text-xs bg-transparent focus:outline-none text-[#111111] resize-y min-h-[90px] leading-relaxed"
          />
          <div className="flex items-center justify-between pt-2 border-t border-[#D5D5CF]">
            <span className="text-[10px] font-mono text-[#777777]">
              Mendukung teks multi-baris &amp; SQL
            </span>
            <div className="flex items-center gap-1.5">
              {question && (
                <button
                  type="button"
                  onClick={() => setQuestion("")}
                  className="p-1 text-[#888888] hover:text-[#111111] transition-colors cursor-pointer"
                  title="Hapus teks"
                  aria-label="Hapus pertanyaan"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                disabled={isPending || !question.trim()}
                className="neo-btn text-xs py-1.5 px-3.5 shadow-[1px_1px_0_#111111] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFD600]"
              >
                {isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={12} />
                )}
                <span>Kirim</span>
              </button>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-mono text-[#666666] leading-relaxed">
          *AI Tutor berperan menjelaskan konsep data relasional dan analisis
          logika, bukan mengeksekusi perintah SQL fisik.
        </p>
      </form>
    </div>
  );
}
