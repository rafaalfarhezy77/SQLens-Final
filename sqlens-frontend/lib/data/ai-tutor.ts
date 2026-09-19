export interface AiTutorScenario {
  id: string;
  prompt: string;
  category:
    | "Penjelasan Query"
    | "Analisis Filter"
    | "Konsep Relasional"
    | "Tips Optimasi";
  answer: string;
  sqlConcept: string;
  reasoning: string[];
}

export const AI_TUTOR_SCENARIOS: AiTutorScenario[] = [
  {
    id: "citra-filtered",
    prompt: "Mengapa Citra Dewi tidak muncul pada tabel hasil akhir query?",
    category: "Analisis Filter",
    answer:
      "Citra Dewi dieleminasi pada Tahap 3 (evaluasi klausa WHERE). Pada tabel scores, skor Citra adalah 70. Kondisi predikat mensyaratkan `score >= 80`, sehingga baris Citra bernilai FALSE dan disingkirkan sebelum tahap proyeksi kolom SELECT.",
    sqlConcept: "Klausa WHERE menyaring data baris demi baris sebelum SELECT.",
    reasoning: [
      "Langkah 1 (FROM & JOIN): Data Citra berhasil dipasangkan dengan skor 70.",
      "Langkah 2 (WHERE): Evaluasi ekspresi (70 >= 80) menghasilkan FALSE.",
      "Langkah 3 (PROJECTION): Hanya baris yang berstatus KEEP yang dikirim ke hasil akhir.",
    ],
  },
  {
    id: "inner-join-explanation",
    prompt: "Bagaimana cara kerja INNER JOIN antara tabel students dan scores?",
    category: "Konsep Relasional",
    answer:
      "INNER JOIN bekerja dengan mencari irisan kesamaan nilai antara kunci primer `students.id` dan kunci asing `scores.student_id`. Hanya pasangan baris yang memiliki nilai kecocokan di kedua tabel yang akan diikutsertakan dalam relasi gabungan.",
    sqlConcept:
      "INNER JOIN = Cartesian Product yang dipangkas oleh predikat ON.",
    reasoning: [
      "Mengambil setiap baris dari tabel students.",
      "Mencocokkan atribut student_id di tabel scores.",
      "Jika mahasiswa belum memiliki nilai atau nilai tidak memiliki mahasiswa, baris tidak dimasukkan ke hasil.",
    ],
  },
  {
    id: "where-vs-having",
    prompt: "Kapan saya harus menggunakan HAVING daripada WHERE?",
    category: "Tips Optimasi",
    answer:
      "Gunakan WHERE untuk menyaring baris individual sebelum pengelompokan (misal: `score >= 80`). Gunakan HAVING untuk menyaring kelompok baris setelah klausa GROUP BY dijalankan (misal: `HAVING COUNT(id) >= 2` atau `HAVING AVG(score) > 80`).",
    sqlConcept:
      "WHERE memfilter baris mentah; HAVING memfilter grup hasil agregasi.",
    reasoning: [
      "Urutan eksekusi DBMS: FROM → WHERE → GROUP BY → HAVING → SELECT.",
      "Fungsi agregat (COUNT, AVG, SUM) tidak boleh ditulis di dalam klausa WHERE.",
    ],
  },
  {
    id: "query-flow",
    prompt:
      "Jelaskan urutan logika eksekusi query SQL (Query Execution Order).",
    category: "Penjelasan Query",
    answer:
      "Meskipun query ditulis diawali kata SELECT, DBMS mengevaluasinya dalam urutan berbeda: Pertama menentukan sumber data (FROM & JOIN), kedua menyaring baris (WHERE), ketiga mengelompokkan (GROUP BY), keempat menyaring grup (HAVING), kelima memilih kolom (SELECT), dan terakhir mengurutkan (ORDER BY).",
    sqlConcept:
      "Logical Query Processing Order berbeda dengan Lexical Order (urutan penulisan).",
    reasoning: [
      "1. FROM & JOIN: Menentukan tabel sumber dan relasi.",
      "2. WHERE: Memfilter baris.",
      "3. GROUP BY & HAVING: Pengelompokan dan filter kelompok.",
      "4. SELECT: Menghitung ekspresi dan memilih kolom.",
      "5. ORDER BY: Mengurutkan hasil akhir.",
    ],
  },
];

export function getAiTutorScenarioAt(index: number): AiTutorScenario {
  const scenario = AI_TUTOR_SCENARIOS[index];

  if (!scenario) {
    throw new Error(`AI Tutor scenario at index ${index} is unavailable.`);
  }

  return scenario;
}

export async function getAiResponseForPrompt(
  promptText: string,
): Promise<AiTutorScenario> {
  const lower = promptText.toLowerCase();

  if (
    lower.includes("citra") ||
    lower.includes("hilang") ||
    lower.includes("tidak muncul")
  ) {
    return getAiTutorScenarioAt(0);
  }
  if (lower.includes("join") || lower.includes("relasi")) {
    return getAiTutorScenarioAt(1);
  }
  if (lower.includes("having") || lower.includes("where")) {
    return getAiTutorScenarioAt(2);
  }

  return getAiTutorScenarioAt(3);
}
