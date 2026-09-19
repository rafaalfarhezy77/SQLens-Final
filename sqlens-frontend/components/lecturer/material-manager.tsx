"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Material } from "@/lib/api/contracts/lecturer";

export function MaterialManager({
  initialMaterials,
}: {
  initialMaterials: Material[];
}) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  function addMaterial(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (title.trim().length < 3) {
      setError("Judul minimal tiga karakter.");
      return;
    }
    if (editingId)
      setMaterials((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, title: title.trim() } : item,
        ),
      );
    else
      setMaterials((current) => [
        ...current,
        {
          id: `local-${Date.now()}`,
          title: title.trim(),
          topic: "SQL",
          difficulty: "Dasar",
          content: "Draft lokal untuk integrasi BFF.",
          sampleSql: "SELECT * FROM students;",
          status: "draft",
        },
      ]);
    setTitle("");
    setEditingId(null);
    setNotice(
      "Draft disimpan pada state demo lokal; belum dipersist ke backend.",
    );
  }
  return (
    <section aria-labelledby="materials-heading" className="space-y-6">
      <div className="border-2 border-[#111111] bg-[#FFF3A3] p-4 shadow-[3px_3px_0_#111111]">
        <p className="font-mono text-xs font-bold text-[#111111]">
          MODE DEMO FRONTEND — endpoint BFF material belum tersedia.
        </p>
      </div>
      <form
        onSubmit={addMaterial}
        className="border-2 border-[#111111] bg-white p-5 shadow-[4px_4px_0_#111111] space-y-4"
      >
        <h2
          id="materials-heading"
          className="font-black uppercase text-base tracking-tight text-[#111111]"
        >
          {editingId ? "Edit Materi / Latihan" : "Buat Materi / Latihan"}
        </h2>
        <div className="space-y-1.5">
          <label
            htmlFor="material-title"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#111111] block"
          >
            Judul
          </label>
          <Input
            id="material-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={Boolean(error)}
          />
        </div>
        <Button type="submit" size="sm">
          Simpan Draft
        </Button>
        {error ? (
          <p
            role="alert"
            className="p-3 bg-red-50 border-2 border-[#ef4444] text-xs font-mono font-bold text-[#ef4444] shadow-[2px_2px_0_#ef4444]"
          >
            {error}
          </p>
        ) : null}
        {notice ? (
          <p
            role="status"
            className="p-3 bg-[#FFF3A3] border-2 border-[#111111] text-xs font-mono font-medium shadow-[2px_2px_0_#111111]"
          >
            {notice}
          </p>
        ) : null}
      </form>
      <div className="space-y-4">
        {materials.length === 0 ? (
          <p className="font-mono text-xs text-black/60 p-4 border-2 border-dashed border-black/30 text-center">
            Belum ada materi.
          </p>
        ) : (
          materials.map((material) => (
            <article
              key={material.id}
              className="border-2 border-[#111111] bg-white p-5 shadow-[3px_3px_0_#111111] space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-base text-[#111111]">
                  {material.title}
                </h3>
                <span className="text-[10px] font-mono font-bold bg-[#FFD600] px-2 py-0.5 border border-[#111111] uppercase">
                  {material.status}
                </span>
              </div>
              <p className="text-xs font-mono text-black/70">
                {material.topic} · {material.difficulty}
              </p>
              <pre className="overflow-x-auto border-2 border-[#111111] bg-[#F7F7F2] p-3 text-xs font-mono text-[#111111] shadow-[2px_2px_0_#111111]">
                {material.sampleSql}
              </pre>
              <div className="pt-2 flex gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingId(material.id);
                    setTitle(material.title);
                  }}
                >
                  Edit Draft
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setMaterials((current) =>
                      current.filter((item) => item.id !== material.id),
                    )
                  }
                >
                  Hapus Draft
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
