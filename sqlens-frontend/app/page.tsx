import type { Metadata } from "next";
import Link from "next/link";
import {
  Code2,
  GitFork,
  CheckCircle2,
  Bot,
  Lightbulb,
  Check,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/landing-header";
import { HeroQueryRunner } from "@/components/landing/hero-query-runner";
import { InteractiveSimulator } from "@/components/landing/interactive-simulator";

export const metadata: Metadata = {
  title: "SQLens – Database Query Tutor | Understand SQL Step-by-Step",
  description:
    "SQLens adalah platform pembelajaran SQL visual yang membantu mahasiswa memahami hubungan antara SQL query, data processing, dan query result tahap demi tahap.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F2] text-[#111111] antialiased bg-grid-pattern selection:bg-[#FFD600] selection:text-[#111111]">
      {/* SECTION 1 — HEADER / NAVIGATION */}
      <LandingHeader />

      <main>
        {/* SECTION 2 — HERO */}
        <section
          className="py-14 sm:py-20 lg:py-24 border-b-4 border-[#111111] relative overflow-hidden"
          aria-labelledby="hero-heading"
        >
          <div className="section-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="neo-badge">
                  <span className="w-2 h-2 rounded-full bg-[#111111] animate-pulse" />
                  DATABASE QUERY TUTOR
                </span>
              </div>

              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] uppercase text-[#111111]"
              >
                DON&apos;T JUST RUN SQL. <br />
                <span className="bg-[#FFD600] px-2 py-0.5 border-2 border-[#111111] shadow-[3px_3px_0_#111111] inline-block mt-2">
                  UNDERSTAND IT.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-[#333333] font-medium leading-relaxed max-w-2xl">
                Tulis query SQL, lihat bagaimana data berubah di setiap tahap,
                dan pahami apa yang sebenarnya dilakukan oleh query tersebut.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="neo-btn text-base sm:text-lg"
                >
                  START LEARNING SQL
                </Link>
                <a
                  href="#how-it-works"
                  className="neo-btn neo-btn-white text-base sm:text-lg"
                >
                  SEE HOW IT WORKS
                </a>
              </div>

              {/* Supporting Microcopy */}
              <p className="font-mono text-xs text-[#666666] flex items-center gap-2 pt-2">
                <Check
                  size={16}
                  className="text-[#111111] shrink-0 stroke-[3]"
                />
                Built for students who want to understand SQL, not just memorize
                syntax.
              </p>
            </div>

            {/* Right Column: Fake SQL Editor / Product Preview */}
            <div className="lg:col-span-5">
              <HeroQueryRunner />
            </div>
          </div>
        </section>

        {/* SECTION 3 — PROBLEM STATEMENT */}
        <section
          id="problem"
          className="py-16 sm:py-24 border-b-4 border-[#111111] bg-[#FFFFFF]"
          aria-labelledby="problem-heading"
        >
          <div className="section-container">
            {/* Section Header */}
            <div className="max-w-3xl mb-12 sm:mb-16">
              <span className="neo-badge mb-3">THE CORE PROBLEM</span>
              <h2
                id="problem-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight text-[#111111]"
              >
                SQL RESULTS ARE EASY TO SEE. <br />
                <span className="bg-[#FFD600] px-2 py-0.5 border-2 border-[#111111] shadow-[2px_2px_0_#111111]">
                  THE PROCESS ISN&apos;T.
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#444444] font-medium leading-relaxed">
                Sebagian besar SQL tools hanya memperlihatkan query dan hasil
                akhir. SQLens membantu mahasiswa melihat proses di antaranya.
              </p>
            </div>

            {/* 2 Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Traditional SQL Tool */}
              <article className="neo-card p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-xl sm:text-2xl tracking-tight uppercase">
                      TRADITIONAL SQL TOOL
                    </h3>
                    <span className="neo-badge neo-badge-dark text-[10px]">
                      BLACK BOX
                    </span>
                  </div>

                  {/* Pipeline Diagram */}
                  <div className="bg-[#F7F7F2] border-2 border-[#111111] p-5 mb-6 text-center font-mono font-bold text-sm sm:text-base space-y-2">
                    <div className="p-2 bg-white border border-[#111111]">
                      Write Query
                    </div>
                    <div className="text-[#888888] font-black text-lg">↓</div>
                    <div className="p-2 bg-white border border-[#111111]">
                      Run Query
                    </div>
                    <div className="text-[#888888] font-black text-lg">↓</div>
                    <div className="p-2 bg-[#EAEAE4] border border-[#111111] text-[#777777]">
                      Final Result
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-[#111111] pt-4">
                  <p className="text-[#555555] text-sm sm:text-base font-medium">
                    Kamu tahu hasil akhirnya, tetapi proses perubahan datanya
                    tidak terlihat.
                  </p>
                </div>
              </article>

              {/* Card 2: SQLens */}
              <article className="neo-card-yellow p-6 sm:p-8 flex flex-col justify-between relative">
                <div className="absolute -top-3.5 right-6">
                  <span className="neo-badge neo-badge-dark text-[11px] px-3 py-1 flex items-center gap-1.5">
                    ★ THE SQLENS WAY
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-xl sm:text-2xl tracking-tight uppercase">
                      SQLENS
                    </h3>
                  </div>

                  {/* Pipeline Diagram */}
                  <div className="bg-white border-2 border-[#111111] p-5 mb-6 text-center font-mono font-bold text-sm sm:text-base space-y-2 shadow-[3px_3px_0_#111111]">
                    <div className="p-2 bg-[#FFF3A3] border border-[#111111]">
                      Write Query
                    </div>
                    <div className="text-[#111111] font-black text-lg">↓</div>
                    <div className="p-2 bg-[#FFF3A3] border border-[#111111]">
                      Run Query
                    </div>
                    <div className="text-[#111111] font-black text-lg">↓</div>
                    <div className="p-2 bg-[#FFD600] border-2 border-[#111111] text-[#111111] font-black">
                      See Every Step
                    </div>
                    <div className="text-[#111111] font-black text-lg">↓</div>
                    <div className="p-2 bg-[#111111] text-white font-black">
                      Understand Why
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-[#111111] pt-4">
                  <p className="text-[#111111] text-sm sm:text-base font-bold">
                    Kamu dapat melihat bagaimana query memproses data sebelum
                    menghasilkan output akhir.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 4 — QUERY-TO-VISUAL EXPLANATION (CORE SECTION) */}
        <section
          id="how-it-works"
          className="py-16 sm:py-24 border-b-4 border-[#111111] bg-[#F7F7F2]"
          aria-labelledby="visual-heading"
        >
          <div className="section-container">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="neo-badge mb-3">
                QUERY-TO-VISUAL EXPLANATION
              </span>
              <h2
                id="visual-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#111111]"
              >
                SEE WHAT YOUR QUERY <br />
                <span className="bg-[#FFD600] px-2 py-0.5 border-2 border-[#111111] shadow-[3px_3px_0_#111111]">
                  ACTUALLY DOES.
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#444444] font-medium leading-relaxed">
                SQLens memecah query menjadi beberapa processing stage agar
                mahasiswa dapat mengikuti perubahan data dari awal hingga hasil
                akhir.
              </p>
            </div>

            {/* 4 Step Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 01: FROM */}
              <article className="neo-card p-6 flex flex-col justify-between group hover:border-[#111111] hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-[#111111] bg-[#FFD600] border-2 border-[#111111] px-2.5 py-1 shadow-[2px_2px_0_#111111]">
                      01
                    </span>
                    <span className="font-mono font-bold text-xs uppercase px-2 py-1 bg-[#F7F7F2] border border-[#111111]">
                      Source
                    </span>
                  </div>
                  <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                    FROM
                  </h3>
                  <p className="text-sm text-[#444444] font-medium leading-relaxed">
                    Menentukan source table yang akan digunakan oleh query.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-[#111111] font-mono text-xs text-[#555555]">
                  <code>dataset = Table(&apos;...&apos;)</code>
                </div>
              </article>

              {/* Step 02: JOIN */}
              <article className="neo-card p-6 flex flex-col justify-between group hover:border-[#111111] hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-[#111111] bg-[#FFD600] border-2 border-[#111111] px-2.5 py-1 shadow-[2px_2px_0_#111111]">
                      02
                    </span>
                    <span className="font-mono font-bold text-xs uppercase px-2 py-1 bg-[#F7F7F2] border border-[#111111]">
                      Relation
                    </span>
                  </div>
                  <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                    JOIN
                  </h3>
                  <p className="text-sm text-[#444444] font-medium leading-relaxed">
                    Melihat bagaimana row dari dua tabel dihubungkan berdasarkan
                    kondisi JOIN.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-[#111111] font-mono text-xs text-[#555555]">
                  <code>ON t1.id == t2.ref_id</code>
                </div>
              </article>

              {/* Step 03: WHERE */}
              <article className="neo-card p-6 flex flex-col justify-between group hover:border-[#111111] hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-[#111111] bg-[#FFD600] border-2 border-[#111111] px-2.5 py-1 shadow-[2px_2px_0_#111111]">
                      03
                    </span>
                    <span className="font-mono font-bold text-xs uppercase px-2 py-1 bg-[#F7F7F2] border border-[#111111]">
                      Filter
                    </span>
                  </div>
                  <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                    WHERE
                  </h3>
                  <p className="text-sm text-[#444444] font-medium leading-relaxed">
                    Melihat row mana yang tetap digunakan dan row mana yang
                    terfilter oleh condition.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-[#111111] font-mono text-xs text-[#555555]">
                  <code>condition == True</code>
                </div>
              </article>

              {/* Step 04: SELECT */}
              <article className="neo-card p-6 flex flex-col justify-between group hover:border-[#111111] hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-3xl sm:text-4xl font-black text-[#111111] bg-[#FFD600] border-2 border-[#111111] px-2.5 py-1 shadow-[2px_2px_0_#111111]">
                      04
                    </span>
                    <span className="font-mono font-bold text-xs uppercase px-2 py-1 bg-[#F7F7F2] border border-[#111111]">
                      Projection
                    </span>
                  </div>
                  <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                    SELECT
                  </h3>
                  <p className="text-sm text-[#444444] font-medium leading-relaxed">
                    Melihat column mana yang akhirnya tampil pada Query Result.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-[#111111] font-mono text-xs text-[#555555]">
                  <code>columns = [col1, col2]</code>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 5 — FEATURE CARDS */}
        <section
          id="features"
          className="py-16 sm:py-24 border-b-4 border-[#111111] bg-[#FFFFFF]"
          aria-labelledby="features-heading"
        >
          <div className="section-container">
            {/* Section Header */}
            <div className="max-w-3xl mb-12 sm:mb-16">
              <span className="neo-badge mb-3">BUILT FOR LEARNING</span>
              <h2
                id="features-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight text-[#111111]"
              >
                LEARN SQL WITH <br />
                <span className="bg-[#FFD600] px-2 py-0.5 border-2 border-[#111111] shadow-[2px_2px_0_#111111]">
                  MORE CONTEXT.
                </span>
              </h2>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1: SQL Editor */}
              <article className="neo-card p-6 sm:p-8">
                <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center mb-5">
                  <Code2 size={24} className="text-[#111111] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                  SQL Editor
                </h3>
                <p className="text-[#555555] font-medium leading-relaxed">
                  Tulis dan eksperimen dengan SQL query dalam environment yang
                  fokus untuk belajar.
                </p>
              </article>

              {/* Feature 2: Query Visualization */}
              <article className="neo-card p-6 sm:p-8">
                <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center mb-5">
                  <GitFork size={24} className="text-[#111111] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                  Query Visualization
                </h3>
                <p className="text-[#555555] font-medium leading-relaxed">
                  Ikuti query processing secara step-by-step, bukan hanya
                  melihat final table.
                </p>
              </article>

              {/* Feature 3: Query Checker */}
              <article className="neo-card p-6 sm:p-8">
                <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center mb-5">
                  <CheckCircle2
                    size={24}
                    className="text-[#111111] stroke-[2.5]"
                  />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                  Query Checker
                </h3>
                <p className="text-[#555555] font-medium leading-relaxed">
                  Temukan query error dan pahami bagian mana yang perlu
                  diperbaiki.
                </p>
              </article>

              {/* Feature 4: AI Tutor */}
              <article className="neo-card p-6 sm:p-8">
                <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center mb-5">
                  <Bot size={24} className="text-[#111111] stroke-[2.5]" />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tight mb-3">
                  AI Tutor
                </h3>
                <p className="text-[#555555] font-medium leading-relaxed">
                  Dapatkan explanation, error guidance, dan hint ketika kamu
                  mengalami kesulitan.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 6 — MINI INTERACTIVE DEMO */}
        <section
          id="demo"
          className="py-16 sm:py-24 border-b-4 border-[#111111] bg-[#F7F7F2]"
          aria-labelledby="demo-heading"
        >
          <div className="section-container">
            {/* Section Header */}
            <div className="max-w-3xl mb-12">
              <span className="neo-badge mb-3">TRY IT IN YOUR BROWSER</span>
              <h2
                id="demo-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#111111]"
              >
                INTERACTIVE QUERY SIMULATOR
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#444444] font-medium leading-relaxed">
                Pilih stage di bawah untuk melihat bagaimana query mengevaluasi
                setiap baris data secara nyata.
              </p>
            </div>

            {/* Simulator Container */}
            <InteractiveSimulator />
          </div>
        </section>

        {/* SECTION 7 — AI TUTOR PREVIEW */}
        <section
          id="ai-tutor"
          className="py-16 sm:py-24 border-b-4 border-[#111111] bg-[#FFFFFF]"
          aria-labelledby="ai-tutor-heading"
        >
          <div className="section-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Explanation & Scope Note */}
            <div className="lg:col-span-6 space-y-6">
              <span className="neo-badge">INTELLIGENT ASSISTANCE</span>

              <h2
                id="ai-tutor-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight text-[#111111]"
              >
                STUCK? <br />
                <span className="bg-[#FFD600] px-2 py-0.5 border-2 border-[#111111] shadow-[2px_2px_0_#111111]">
                  ASK THE AI TUTOR.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[#444444] font-medium leading-relaxed">
                AI Tutor membantu menjelaskan query, memberikan error
                explanation, dan memberi hint ketika kamu mengalami kesulitan.
              </p>

              {/* Aside: Technical Responsibility Note */}
              <aside
                className="p-4 sm:p-5 bg-[#F7F7F2] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-start gap-3.5"
                aria-label="Catatan Arsitektur AI Tutor"
              >
                <div className="w-6 h-6 bg-[#FFD600] border border-[#111111] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  i
                </div>
                <p className="text-xs sm:text-sm text-[#333333] font-medium leading-normal">
                  <strong className="text-[#111111] font-bold">
                    Catatan Edukasi:
                  </strong>{" "}
                  AI Tutor membantu proses belajar. SQL execution tetap
                  dilakukan secara deterministik oleh SQL Engine.
                </p>
              </aside>

              <div>
                <Link
                  href="/dashboard/ai-tutor"
                  className="inline-flex items-center gap-2 neo-btn text-sm py-3 px-6 shadow-[3px_3px_0_#111111]"
                >
                  BUKA AI TUTOR INTERAKTIF &rarr;
                </Link>
              </div>
            </div>

            {/* Right Column: Neo-Brutalist Chat UI Preview */}
            <div className="lg:col-span-6">
              <div className="neo-card p-6 sm:p-7 bg-[#F7F7F2]">
                {/* Chat Window Header */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-[#111111] mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-[#00D084] border border-[#111111]" />
                    <span className="font-mono text-xs font-bold text-[#111111]">
                      AI Tutor Assistant
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-[#666666]">
                    ONLINE &bull; READY
                  </span>
                </div>

                {/* Chat Messages Flow */}
                <div className="space-y-5 font-sans">
                  {/* Student Message */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold text-[#111111]">
                        Student
                      </span>
                      <span className="font-mono text-[10px] text-[#777777]">
                        10:42 AM
                      </span>
                    </div>
                    <div className="bg-[#FFFFFF] border-2 border-[#111111] p-3.5 sm:p-4 shadow-[3px_3px_0_#111111] max-w-sm sm:max-w-md">
                      <p className="font-bold text-sm text-[#111111]">
                        Why is my JOIN returning duplicate rows?
                      </p>
                    </div>
                  </div>

                  {/* AI Tutor Response Bubble */}
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold bg-[#FFD600] px-1.5 border border-[#111111]">
                        AI Tutor
                      </span>
                      <span className="font-mono text-[10px] text-[#777777]">
                        10:42 AM
                      </span>
                    </div>
                    <div className="bg-[#FFF3A3] border-2 border-[#111111] p-4 shadow-[3px_3px_0_#111111] max-w-sm sm:max-w-md">
                      <p className="text-sm text-[#111111] font-medium leading-relaxed">
                        Kemungkinan JOIN condition kamu menghasilkan{" "}
                        <strong>one-to-many relationship</strong>. Coba periksa
                        apakah satu row pada tabel pertama cocok dengan beberapa
                        row pada tabel kedua.
                      </p>

                      <div className="mt-3 pt-3 border-t border-[#111111] flex items-center justify-between text-[11px] font-mono font-bold text-[#555555]">
                        <span className="flex items-center gap-1.5">
                          <Lightbulb size={14} className="text-[#111111]" />
                          Hint: Periksa Primary &amp; Foreign Key
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Prompt Input */}
                <div className="mt-6 pt-4 border-t-2 border-[#111111] flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="Tanyakan hal seputar SQL query kamu..."
                    className="w-full bg-white border-2 border-[#111111] p-2.5 font-mono text-xs text-[#777777] cursor-not-allowed"
                    aria-label="Input Chat Mockup AI Tutor"
                  />
                  <button
                    type="button"
                    disabled
                    className="neo-btn text-xs py-2 px-3 bg-[#FFD600] opacity-80 cursor-not-allowed shadow-[2px_2px_0_#111111]"
                    aria-label="Kirim Pesan"
                  >
                    ASK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 — CALL TO ACTION (CTA) */}
        <section
          id="cta"
          className="py-20 sm:py-28 bg-[#FFD600] border-b-4 border-[#111111] text-center relative overflow-hidden"
          aria-labelledby="cta-heading"
        >
          <div className="section-container relative z-10 max-w-4xl mx-auto space-y-8">
            <span className="neo-badge neo-badge-dark text-xs py-1 px-3">
              START YOUR JOURNEY
            </span>

            <h2
              id="cta-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1] text-[#111111]"
            >
              READY TO SEE SQL DIFFERENTLY?
            </h2>

            <p className="text-lg sm:text-xl text-[#111111] font-bold max-w-2xl mx-auto leading-relaxed">
              Jangan hanya melihat final result. Pahami bagaimana query kamu
              bekerja.
            </p>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="neo-btn neo-btn-dark text-base sm:text-xl py-4 px-8 shadow-[6px_6px_0_#111111]"
              >
                START LEARNING SQL &rarr;
              </Link>
            </div>

            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#333333]">
              Free to use for students &bull; No credit card required &bull;
              100% Visual
            </p>
          </div>
        </section>
      </main>

      {/* SECTION 9 — FOOTER */}
      <footer className="bg-[#FFFFFF] py-14 sm:py-16 text-[#111111]">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b-2 border-[#111111]">
            {/* Brand & Tagline */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FFD600] border-2 border-[#111111] flex items-center justify-center font-mono font-black text-base shadow-[2px_2px_0_#111111]">
                  SQ
                </div>
                <div>
                  <span className="font-black text-xl tracking-tight">
                    SQLens
                  </span>
                  <span className="block font-mono text-[11px] font-semibold text-[#555555]">
                    Database Query Tutor
                  </span>
                </div>
              </div>
              <p className="text-sm text-[#444444] font-medium max-w-sm leading-relaxed">
                Learn SQL by seeing what happens to your data.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-6 flex flex-wrap gap-8 md:justify-end font-mono text-xs uppercase font-bold">
              <div className="space-y-3">
                <span className="text-[#888888] tracking-wider block">
                  Platform
                </span>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/dashboard"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5 font-bold text-[#111111]"
                    >
                      Dashboard &rarr;
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/playground"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5 font-bold text-[#111111]"
                    >
                      SQL Playground &rarr;
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/query-history"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5 font-bold text-[#111111]"
                    >
                      Query History &rarr;
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#demo"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5"
                    >
                      Interactive Demo
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-[#888888] tracking-wider block">
                  Resources
                </span>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/login"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5"
                    >
                      Register
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard/ai-tutor"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5"
                    >
                      AI Tutor
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#problem"
                      className="hover:underline hover:bg-[#FFF3A3] p-0.5"
                    >
                      Methodology
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#666666]">
            <p>&copy; SQLens — Database Query Tutor. All rights reserved.</p>
            <p>
              Built with Neo-Brutalism &bull; Next.js 16 &bull; Tailwind CSS v4
              &bull; TypeScript
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
