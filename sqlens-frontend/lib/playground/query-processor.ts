import { queryInputSchema } from "@/lib/schemas/query";
import type { PipelineSimulationResult, QueryStep } from "./query-steps";

export const DEFAULT_SQL_QUERY = `SELECT s.name, sc.score
FROM students s
JOIN scores sc
  ON s.id = sc.student_id
WHERE sc.score >= 80;`;

export function processQuerySimulation(rawQuery: string): {
  success: boolean;
  error?: string;
  data?: PipelineSimulationResult;
} {
  const validation = queryInputSchema.safeParse({ query: rawQuery });

  if (!validation.success) {
    return {
      success: false,
      error:
        validation.error.flatten().fieldErrors.query?.[0] ||
        "Query tidak valid.",
    };
  }

  const query = validation.data.query.trim();
  const upper = query.toUpperCase();

  // Scenario 1: Default Query / JOIN with WHERE score filter
  const isJoinQuery = upper.includes("JOIN") || upper.includes("SCORES");

  if (isJoinQuery) {
    const steps: QueryStep[] = [
      {
        stepNumber: 1,
        clause: "FROM students s",
        title: "Pemilihan Tabel Sumber (Data Source)",
        badge: "01 / FROM",
        description:
          "DBMS memuat dataset awal dari tabel utama `students` ke memori.",
        explanation:
          "4 baris data mahasiswa dimuat ke buffer eksekusi sebelum operasi relasional.",
        rowsBeforeCount: 4,
        rowsAfterCount: 4,
        rowEvaluations: [
          {
            id: "s-1",
            data: { id: 1, name: "Andi Pratama", major: "Informatika" },
            status: "source",
            statusText: "LOADED",
            reason: "Baris tabel primer termuat",
          },
          {
            id: "s-2",
            data: { id: 2, name: "Budi Santoso", major: "Sistem Informasi" },
            status: "source",
            statusText: "LOADED",
            reason: "Baris tabel primer termuat",
          },
          {
            id: "s-3",
            data: { id: 3, name: "Citra Dewi", major: "Informatika" },
            status: "source",
            statusText: "LOADED",
            reason: "Baris tabel primer termuat",
          },
          {
            id: "s-4",
            data: { id: 4, name: "Dian Anggraini", major: "Teknik Komputer" },
            status: "source",
            statusText: "LOADED",
            reason: "Baris tabel primer termuat",
          },
        ],
      },
      {
        stepNumber: 2,
        clause: "JOIN scores sc ON s.id = sc.student_id",
        title: "Pencocokan Relasional (INNER JOIN)",
        badge: "02 / JOIN",
        description:
          "Mencari kecocokan kunci antara `students.id` dan `scores.student_id`.",
        explanation:
          "Setiap baris mahasiswa dipasangkan dengan rekaman nilainya berdasarkan kesamaan ID relasional.",
        rowsBeforeCount: 4,
        rowsAfterCount: 4,
        joinDetails: {
          leftTable: "students",
          rightTable: "scores",
          leftKey: "id",
          rightKey: "student_id",
          joinType: "INNER JOIN",
        },
        rowEvaluations: [
          {
            id: "j-1",
            data: { "s.name": "Andi Pratama", "sc.score": 90, match: "1 = 1" },
            status: "joined",
            statusText: "MATCHED",
            reason: "Kunci ID cocok (1 = 1)",
          },
          {
            id: "j-2",
            data: { "s.name": "Budi Santoso", "sc.score": 85, match: "2 = 2" },
            status: "joined",
            statusText: "MATCHED",
            reason: "Kunci ID cocok (2 = 2)",
          },
          {
            id: "j-3",
            data: { "s.name": "Citra Dewi", "sc.score": 70, match: "3 = 3" },
            status: "joined",
            statusText: "MATCHED",
            reason: "Kunci ID cocok (3 = 3)",
          },
          {
            id: "j-4",
            data: {
              "s.name": "Dian Anggraini",
              "sc.score": 65,
              match: "4 = 4",
            },
            status: "joined",
            statusText: "MATCHED",
            reason: "Kunci ID cocok (4 = 4)",
          },
        ],
      },
      {
        stepNumber: 3,
        clause: "WHERE sc.score >= 80",
        title: "Penyaringan Predikat (Row Filtering)",
        badge: "03 / WHERE",
        description:
          "Mengevaluasi kondisi boolean `score >= 80` pada setiap baris gabungan.",
        explanation:
          "Baris yang menghasilkan TRUE dipertahankan (KEEP). Baris bernilai FALSE dieliminasi (FILTERED).",
        rowsBeforeCount: 4,
        rowsAfterCount: 2,
        rowEvaluations: [
          {
            id: "w-1",
            data: { name: "Andi Pratama", score: 90, eval: "90 >= 80 (TRUE)" },
            status: "keep",
            statusText: "KEEP",
            reason: "Skor 90 memenuhi batas minimal 80",
          },
          {
            id: "w-2",
            data: { name: "Budi Santoso", score: 85, eval: "85 >= 80 (TRUE)" },
            status: "keep",
            statusText: "KEEP",
            reason: "Skor 85 memenuhi batas minimal 80",
          },
          {
            id: "w-3",
            data: { name: "Citra Dewi", score: 70, eval: "70 >= 80 (FALSE)" },
            status: "filtered",
            statusText: "FILTERED",
            reason: "Skor 70 di bawah batas ambang 80",
          },
          {
            id: "w-4",
            data: {
              name: "Dian Anggraini",
              score: 65,
              eval: "65 >= 80 (FALSE)",
            },
            status: "filtered",
            statusText: "FILTERED",
            reason: "Skor 65 di bawah batas ambang 80",
          },
        ],
      },
      {
        stepNumber: 4,
        clause: "SELECT s.name, sc.score",
        title: "Proyeksi Kolom Akhir (Column Projection)",
        badge: "04 / SELECT",
        description:
          "Memilih hanya atribut yang diminta oleh pengguna (`name` dan `score`).",
        explanation:
          "Kolom-kolom perantara disingkirkan. Hanya dataset hasil proyeksi yang dikirimkan ke pengguna.",
        rowsBeforeCount: 2,
        rowsAfterCount: 2,
        rowEvaluations: [
          {
            id: "p-1",
            data: { name: "Andi Pratama", score: 90 },
            status: "keep",
            statusText: "OUTPUT",
            reason: "Proyeksi kolom selesai",
          },
          {
            id: "p-2",
            data: { name: "Budi Santoso", score: 85 },
            status: "keep",
            statusText: "OUTPUT",
            reason: "Proyeksi kolom selesai",
          },
        ],
      },
    ];

    return {
      success: true,
      data: {
        query,
        executionTimeMs: 12,
        columns: ["name", "score"],
        finalRows: [
          { name: "Andi Pratama", score: 90 },
          { name: "Budi Santoso", score: 85 },
        ],
        totalRows: 2,
        steps,
      },
    };
  }

  // Scenario 2: Single Table Query (e.g. SELECT * FROM students)
  const steps: QueryStep[] = [
    {
      stepNumber: 1,
      clause: "FROM students",
      title: "Pemilihan Tabel Sumber (Data Source)",
      badge: "01 / FROM",
      description: "DBMS memuat seluruh dataset dari tabel `students`.",
      explanation: "Tabel `students` dipilih sebagai satu-satunya sumber data.",
      rowsBeforeCount: 4,
      rowsAfterCount: 4,
      rowEvaluations: [
        {
          id: "st-1",
          data: { id: 1, name: "Andi Pratama", major: "Informatika" },
          status: "source",
          statusText: "LOADED",
          reason: "Baris termuat",
        },
        {
          id: "st-2",
          data: { id: 2, name: "Budi Santoso", major: "Sistem Informasi" },
          status: "source",
          statusText: "LOADED",
          reason: "Baris termuat",
        },
        {
          id: "st-3",
          data: { id: 3, name: "Citra Dewi", major: "Informatika" },
          status: "source",
          statusText: "LOADED",
          reason: "Baris termuat",
        },
        {
          id: "st-4",
          data: { id: 4, name: "Dian Anggraini", major: "Teknik Komputer" },
          status: "source",
          statusText: "LOADED",
          reason: "Baris termuat",
        },
      ],
    },
    {
      stepNumber: 2,
      clause: "SELECT *",
      title: "Proyeksi Kolom",
      badge: "02 / SELECT",
      description: "Menampilkan seluruh kolom tanpa filter predikat.",
      explanation:
        "Semua baris dan kolom diproyeksikan langsung ke hasil akhir.",
      rowsBeforeCount: 4,
      rowsAfterCount: 4,
      rowEvaluations: [
        {
          id: "st-res-1",
          data: { id: 1, name: "Andi Pratama", major: "Informatika" },
          status: "keep",
          statusText: "OUTPUT",
          reason: "Baris ditampilkan",
        },
        {
          id: "st-res-2",
          data: { id: 2, name: "Budi Santoso", major: "Sistem Informasi" },
          status: "keep",
          statusText: "OUTPUT",
          reason: "Baris ditampilkan",
        },
        {
          id: "st-res-3",
          data: { id: 3, name: "Citra Dewi", major: "Informatika" },
          status: "keep",
          statusText: "OUTPUT",
          reason: "Baris ditampilkan",
        },
        {
          id: "st-res-4",
          data: { id: 4, name: "Dian Anggraini", major: "Teknik Komputer" },
          status: "keep",
          statusText: "OUTPUT",
          reason: "Baris ditampilkan",
        },
      ],
    },
  ];

  return {
    success: true,
    data: {
      query,
      executionTimeMs: 8,
      columns: ["id", "name", "major"],
      finalRows: [
        { id: 1, name: "Andi Pratama", major: "Informatika" },
        { id: 2, name: "Budi Santoso", major: "Sistem Informasi" },
        { id: 3, name: "Citra Dewi", major: "Informatika" },
        { id: 4, name: "Dian Anggraini", major: "Teknik Komputer" },
      ],
      totalRows: 4,
      steps,
    },
  };
}
