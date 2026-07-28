"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CVPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [pengalaman, setPengalaman] = useState("");
  const [keahlian, setKeahlian] = useState("");

  useEffect(() => {
    setNama(localStorage.getItem("nama") || "");
    setEmail(localStorage.getItem("email") || "");
    setPendidikan(localStorage.getItem("pendidikan") || "");
    setPengalaman(localStorage.getItem("pengalaman") || "");
    setKeahlian(localStorage.getItem("keahlian") || "");
  }, []);

  function simpanCV() {
    localStorage.setItem("nama", nama);
    localStorage.setItem("email", email);
    localStorage.setItem("pendidikan", pendidikan);
    localStorage.setItem("pengalaman", pengalaman);
    localStorage.setItem("keahlian", keahlian);

    alert("CV berhasil disimpan");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">
        CV Saya
      </h1>

      <div className="space-y-4 max-w-xl">

        <input
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Nama Lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Pendidikan"
          value={pendidikan}
          onChange={(e) => setPendidikan(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Pengalaman Kerja"
          value={pengalaman}
          onChange={(e) => setPengalaman(e.target.value)}
        />

        <input
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Keahlian"
          value={keahlian}
          onChange={(e) => setKeahlian(e.target.value)}
        />

        <button
          onClick={simpanCV}
          className="bg-blue-600 px-5 py-3 rounded"
        >
          Simpan CV
        </button>

        <Link href="/dashboard">
          <button className="bg-slate-700 px-5 py-3 rounded">
            Kembali ke Dashboard
          </button>
        </Link>

      </div>
    </main>
  );
}
