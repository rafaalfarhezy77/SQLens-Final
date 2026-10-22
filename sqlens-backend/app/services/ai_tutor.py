import json
import re
import urllib.error
import urllib.request
from typing import Any

from app.core.config import get_settings
from app.schemas.ai_tutor import AiTutorResponse

SYSTEM_PROMPT = (
    "Anda adalah SQLens Tutor, asisten pedagogis interaktif untuk pembelajaran basis data. "
    "Anda TIDAK mengeksekusi SQL dan TIDAK menyatakan query valid tanpa hasil SQL engine. "
    "Beri penjelasan pendidikan SQL dalam Bahasa Indonesia dengan gaya Socratic (membimbing pemahaman). "
    "Kembalikan respon DALAM FORMAT JSON SAJA dengan 4 key: "
    "'explanation' (string penjelasan konseptual), "
    "'hint' (string petunjuk pemecahan masalah), "
    "'sqlConcept' (string konsep SQL utama), dan "
    "'reasoning' (array berisi 1 sampai 5 string langkah penalaran alur data)."
)

FALLBACK_SCENARIOS = [
    {
        "keywords": ["citra", "filter", "hilang", "kenapa", "tidak muncul"],
        "explanation": "Baris data dieleminasi pada tahap evaluasi klausa WHERE. Kondisi predikat menguji setiap baris; baris yang menghasilkan evaluasi boolean FALSE atau NULL langsung disingkirkan sebelum tahap proyeksi kolom SELECT.",
        "hint": "Periksa kembali operator pembanding dan nilai ambang batas pada klausa WHERE Anda.",
        "sqlConcept": "Klausa WHERE menyaring data baris demi baris secara independen.",
        "reasoning": [
            "1. Memuat tabel sumber data pada tahap FROM & JOIN.",
            "2. Menguji ekspresi predikat boolean pada setiap baris data.",
            "3. Baris yang bernilai TRUE dipertahankan (KEEP), sedangkan yang FALSE dibuang (FILTERED).",
            "4. Hasil yang lolos dikirim ke tahap proyeksi SELECT.",
        ],
    },
    {
        "keywords": ["join", "inner", "left", "right", "gabung", "relasi"],
        "explanation": "Operasi JOIN menggabungkan rekaman dari dua tabel berdasarkan kondisi kesesuaian pada klausa ON. Pada INNER JOIN, hanya pasangan baris yang memiliki nilai kunci yang cocok di kedua tabel yang akan diikutsertakan.",
        "hint": "Pastikan primary key dari tabel induk cocok dengan foreign key pada tabel anak.",
        "sqlConcept": "JOIN menghubungkan relasi antar entitas menggunakan kesamaan kunci (ON predicate).",
        "reasoning": [
            "1. Membaca tabel pertama (Left Table) dan tabel kedua (Right Table).",
            "2. Mengevaluasi kondisi pencocokan kunci pada klausa ON untuk setiap kemungkinan pasangan.",
            "3. Menggabungkan kolom kedua tabel menjadi satu baris komposit untuk setiap kecocokan.",
        ],
    },
    {
        "keywords": ["having", "group by", "agregat", "count", "sum", "avg"],
        "explanation": "Klausa WHERE digunakan untuk menyaring baris individual sebelum proses pengelompokan. Sebaliknya, klausa HAVING digunakan untuk menyaring kelompok baris setelah operasi GROUP BY dan fungsi agregasi selesai dihitung.",
        "hint": "Gunakan WHERE untuk memfilter baris mentah, dan gunakan HAVING jika kondisi melibatkan fungsi agregasi seperti COUNT(), SUM(), atau AVG().",
        "sqlConcept": "WHERE memfilter baris individu; HAVING memfilter grup baris hasil agregasi.",
        "reasoning": [
            "1. Tahap FROM & WHERE memfilter baris mentah terlebih dahulu.",
            "2. Tahap GROUP BY mengelompokkan baris berdasarkan kolom yang ditentukan.",
            "3. Fungsi agregasi dihitung untuk setiap grup.",
            "4. Tahap HAVING menyaring grup berdasarkan hasil kalkulasi agregasi.",
        ],
    },
    {
        "keywords": ["urutan", "order", "alur", "eksekusi", "processing"],
        "explanation": "Urutan logika eksekusi query SQL oleh RDBMS berbeda dengan urutan penulisannya. Sintaks ditulis mulai dari SELECT, namun DBMS memprosesnya dari FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.",
        "hint": "Pahami bahwa klausa WHERE tidak dapat mengenali alias kolom yang didefinisikan pada klausa SELECT karena WHERE dieksekusi lebih dahulu.",
        "sqlConcept": "Logical Query Processing Order pada RDBMS.",
        "reasoning": [
            "1. FROM & JOIN: Menentukan dan menggabungkan tabel sumber data.",
            "2. WHERE: Menyaring baris data mentah.",
            "3. GROUP BY & HAVING: Mengelompokkan dan menyaring grup agregat.",
            "4. SELECT: Memproyeksikan kolom dan mengevaluasi ekspresi.",
            "5. ORDER BY & LIMIT: Mengurutkan dan membatasi jumlah baris hasil.",
        ],
    },
]


class AiTutorService:
    def ask(self, prompt: str, query: str | None = None, context: str | None = None) -> AiTutorResponse:
        settings = get_settings()

        if settings.openrouter_api_key:
            response = self._call_llm(settings, prompt, query, context)
            if response is not None:
                return response

        return self._get_fallback_response(prompt, query)

    def _call_llm(
        self, settings: Any, prompt: str, query: str | None, context: str | None
    ) -> AiTutorResponse | None:
        user_content = prompt
        if query:
            user_content = f"Query yang sedang dipelajari:\n```sql\n{query}\n```\n\nPertanyaan mahasiswa:\n{prompt}"
        if context:
            user_content += f"\n\nKonteks materi: {context}"

        request_body = {
            "model": settings.sqlens_ai_model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content[:2000]},
            ],
        }

        endpoint = settings.sqlens_ai_base_url
        req = urllib.request.Request(
            endpoint,
            data=json.dumps(request_body).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "Content-Type": "application/json",
                "User-Agent": "SQLens-Backend/1.0",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                res_body = json.loads(response.read().decode("utf-8"))
                choices = res_body.get("choices", [])
                if not choices:
                    return None
                content = choices[0].get("message", {}).get("content", "")
                clean_json = content.strip()
                if clean_json.startswith("```"):
                    clean_json = re.sub(r"^```(?:json)?\s*", "", clean_json, flags=re.IGNORECASE)
                    clean_json = re.sub(r"\s*```$", "", clean_json)
                parsed = json.loads(clean_json)

                return AiTutorResponse(
                    explanation=parsed.get("explanation", "Penjelasan konsep query."),
                    hint=parsed.get("hint", "Gunakan SQL Playground untuk menguji query."),
                    sqlConcept=parsed.get("sqlConcept") or parsed.get("sql_concept", "Konsep Dasar SQL"),
                    reasoning=parsed.get("reasoning", ["Langkah analisis alur data."]),
                )
        except Exception:
            return None

    def _get_fallback_response(self, prompt: str, query: str | None) -> AiTutorResponse:
        search_text = f"{prompt} {query or ''}".lower()
        for scenario in FALLBACK_SCENARIOS:
            for kw in scenario["keywords"]:
                if kw in search_text:
                    return AiTutorResponse(
                        explanation=scenario["explanation"],
                        hint=scenario["hint"],
                        sqlConcept=scenario["sqlConcept"],
                        reasoning=scenario["reasoning"],
                    )

        # Default Socratic fallback
        return AiTutorResponse(
            explanation="Dalam SQL, database memproses data secara deklaratif melalui serangkaian transformasi logis: mulai dari pengambilan sumber tabel (FROM), pemfilteran predikat (WHERE), hingga proyeksi kolom (SELECT).",
            hint="Cobalah jalankan query ini di SQL Playground dan amati perubahan baris data pada setiap langkah visualisasi.",
            sqlConcept="Deklaratif vs Pemrosesan Prosedural SQL",
            reasoning=[
                "1. Database memvalidasi sintaksis deklaratif query SQL.",
                "2. RDBMS menentukan rencana eksekusi (Query Execution Plan) yang paling efisien.",
                "3. Tahapan alur data menyaring rekaman baris demi baris sebelum menghasilkan tabel keluaran.",
            ],
        )
