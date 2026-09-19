"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileCard({
  user,
}: {
  user: { name: string; email: string; role: "mahasiswa" | "dosen" };
}) {
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState<string | null>(null);
  return (
    <section
      aria-labelledby="profile-heading"
      className="border-2 border-[#111111] bg-white p-6 shadow-[4px_4px_0px_0px_#111111] space-y-5 max-w-2xl"
    >
      <div className="border-b-2 border-[#111111] pb-3">
        <h2
          id="profile-heading"
          className="font-black text-xl uppercase tracking-tight text-[#111111]"
        >
          Profil Akun
        </h2>
        <p className="text-xs font-mono text-black/60 mt-0.5">
          Identitas sesi tepercaya yang terverifikasi di server.
        </p>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono p-4 bg-[#F7F7F2] border-2 border-[#111111]">
        <div>
          <dt className="font-bold text-black/60 uppercase text-[10px]">
            Email Terdaftar
          </dt>
          <dd className="font-bold text-sm text-[#111111] mt-0.5">
            {user.email}
          </dd>
        </div>
        <div>
          <dt className="font-bold text-black/60 uppercase text-[10px]">
            Peran Pengguna
          </dt>
          <dd className="font-bold text-sm uppercase mt-0.5 text-[#111111]">
            <span className="bg-[#FFD600] px-2 py-0.5 border border-[#111111]">
              {user.role === "dosen" ? "Dosen/Asisten" : "Mahasiswa"}
            </span>
          </dd>
        </div>
      </dl>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(
            "Perubahan profil belum dapat dikirim: endpoint profil BFF belum tersedia.",
          );
        }}
        className="space-y-3 pt-2"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="profile-name"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#111111] block"
          >
            Nama Tampilan
          </label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
          />
        </div>
        <Button type="submit" size="sm">
          Simpan Perubahan
        </Button>
        {message ? (
          <p
            role="status"
            className="p-3 bg-[#FFF3A3] border-2 border-[#111111] text-xs font-mono font-medium shadow-[2px_2px_0px_0px_#111111]"
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
