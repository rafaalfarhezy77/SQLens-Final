import { unstable_cache } from "next/cache";

export interface LessonModule {
  id: string;
  slug: string;
  title: string;
  difficulty: "Dasar" | "Menengah" | "Lanjutan";
  status: "Selesai" | "Sedang Berjalan" | "Terkunci";
  progressPercent: number;
  description: string;
  overview: string;
  keyConcepts: string[];
  sampleQuery: string;
  queryExplanation: string;
}

export const LEARNING_MODULES: LessonModule[] = [
  {
    id: "MOD-01",
    slug: "sql-fundamentals",
    title: "Fondasi Sintaksis & Proyeksi Kolom (SELECT)",
    difficulty: "Dasar",
    status: "Selesai",
    progressPercent: 100,
    description:
      "Mempelajari struktur deklaratif SQL, proyeksi kolom, penggunaan alias (AS), dan evaluasi ekspresi.",
    overview:
      "Perintah SELECT adalah blok bangunan paling mendasar dalam SQL. Mahasiswa diajarkan bagaimana DBMS mengidentifikasi kolom target tanpa melakukan mutasi pada tabel fisik.",
    keyConcepts: [
      "Proyeksi kolom tertentu vs SELECT *",
      "Kolom Alias menggunakan klausa AS",
      "Kalkulasi aritmatika dalam ekspresi proyeksi",
      "Eliminasi duplikasi menggunakan SELECT DISTINCT",
    ],
    sampleQuery: "SELECT id, name AS nama_mahasiswa, major FROM students;",
    queryExplanation:
      "Query ini memproyeksikan kolom id, name (dialias menjadi nama_mahasiswa), dan major dari tabel students tanpa menerapkan filter baris.",
  },
  {
    id: "MOD-02",
    slug: "filtering-where",
    title: "Filtering Baris & Predikat Logika (WHERE)",
    difficulty: "Dasar",
    status: "Selesai",
    progressPercent: 100,
    description:
      "Memahami evaluasi predikat kondisi boolean per baris: operator perbandingan, AND, OR, dan NOT.",
    overview:
      "Klausa WHERE menyaring data baris demi baris sebelum hasil dikirim ke tahap proyeksi. Setiap baris diuji terhadap ekspresi boolean: baris yang menghasilkan TRUE dipertahankan, sedangkan FALSE atau NULL dibuang.",
    keyConcepts: [
      "Evaluasi predikat per baris (Row-by-Row evaluation)",
      "Operator logika: AND, OR, NOT",
      "Pencarian rentang nilai: BETWEEN ... AND ...",
      "Pencarian keanggotaan himpunan: IN (...)",
    ],
    sampleQuery:
      "SELECT * FROM scores WHERE score >= 80 AND course = 'Basis Data';",
    queryExplanation:
      "DBMS memindai baris tabel scores dan hanya mempertahankan rekaman yang memenuhi kedua kondisi: nilai minimal 80 DAN mata kuliah 'Basis Data'.",
  },
  {
    id: "MOD-03",
    slug: "sql-joins",
    title: "Relasi Multi-Tabel & Operasi JOIN",
    difficulty: "Menengah",
    status: "Sedang Berjalan",
    progressPercent: 75,
    description:
      "Menghubungkan data dari tabel terpisah melalui kecocokan Foreign Key dengan INNER JOIN dan OUTER JOIN.",
    overview:
      "JOIN adalah inti dari model relasional. Modul ini membimbing mahasiswa memvisualisasikan Cartesian Product yang kemudian dipangkas oleh kondisi ON.",
    keyConcepts: [
      "Prinsip kecocokan Primary Key dan Foreign Key",
      "INNER JOIN: irisan data yang cocok di kedua tabel",
      "LEFT OUTER JOIN: seluruh baris tabel kiri dipertahankan",
      "Visualisasi evaluasi predikat ON vs WHERE",
    ],
    sampleQuery:
      "SELECT s.name, sc.score FROM students s JOIN scores sc ON s.id = sc.student_id WHERE sc.score >= 80;",
    queryExplanation:
      "Tabel students digabungkan dengan scores berdasarkan kesamaan ID. Setelah relasi terbentuk, filter WHERE membatasi hasil hanya untuk nilai >= 80.",
  },
  {
    id: "MOD-04",
    slug: "aggregations",
    title: "Agregasi Data & Pengelompokan (GROUP BY & HAVING)",
    difficulty: "Menengah",
    status: "Terkunci",
    progressPercent: 30,
    description:
      "Menggunakan fungsi agregat (COUNT, AVG, SUM, MIN, MAX) serta penyaringan grup menggunakan klausa HAVING.",
    overview:
      "Klausa GROUP BY mengubah himpunan baris individual menjadi himpunan ringkasan kelompok. Mahasiswa mempelajari perbedaan fundamental antara filter baris WHERE dan filter grup HAVING.",
    keyConcepts: [
      "Fungsi agregat: COUNT, SUM, AVG, MIN, MAX",
      "Pengelompokan atribut dengan GROUP BY",
      "Penyaringan grup hasil agregasi dengan HAVING",
      "Perbedaan krusial WHERE vs HAVING",
    ],
    sampleQuery:
      "SELECT major, COUNT(id) AS jumlah_mhs FROM students GROUP BY major HAVING COUNT(id) >= 2;",
    queryExplanation:
      "Data mahasiswa dikelompokkan berdasarkan jurusan, lalu klausa HAVING menyaring kelompok jurusan yang memiliki minimal 2 mahasiswa.",
  },
  {
    id: "MOD-05",
    slug: "subqueries",
    title: "Subquery & Common Table Expressions (CTE)",
    difficulty: "Lanjutan",
    status: "Terkunci",
    progressPercent: 0,
    description:
      "Menulis query bersarang (nested subqueries), correlated subqueries, dan modularisasi kueri dengan CTE WITH.",
    overview:
      "Mempelajari teknik menulis query di dalam query untuk memecahkan problem data relasional bertingkat yang tidak dapat diselesaikan dengan agregasi sederhana.",
    keyConcepts: [
      "Scalar Subquery vs Table Subquery",
      "Subquery di klausa WHERE dan FROM",
      "Klausul WITH (Common Table Expressions)",
      "Optimasi dan pemahaman alur eksekusi subquery",
    ],
    sampleQuery:
      "WITH HighScores AS (SELECT * FROM scores WHERE score >= 85) SELECT s.name, hs.score FROM students s JOIN HighScores hs ON s.id = hs.student_id;",
    queryExplanation:
      "CTE HighScores mendefinisikan dataset sementara yang berisi nilai tinggi, yang kemudian digabungkan dengan tabel mahasiswa.",
  },
];

const getCachedModules = unstable_cache(
  async (): Promise<LessonModule[]> => LEARNING_MODULES,
  ["sqlens-learning-modules-v1"],
  { revalidate: 3600 },
);

export async function getAllModules(): Promise<LessonModule[]> {
  return getCachedModules();
}

export async function getModuleBySlug(
  slug: string,
): Promise<LessonModule | null> {
  const modules = await getCachedModules();
  const found = modules.find((m) => m.slug === slug);
  return found || null;
}
