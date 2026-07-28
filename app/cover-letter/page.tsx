"use client";

import { useState } from "react";

export default function CoverLetterPage() {
  const [posisi, setPosisi] = useState("");
  const [hasil, setHasil] = useState("");
  const [loading, setLoading] = useState(false);

  async function buatCoverLetter() {
    setLoading(true);
    setHasil("");

    try {
      const nama = localStorage.getItem("nama") || "Pelamar";
      const pengalaman = localStorage.getItem("pengalaman") || "-";
      const keahlian = localStorage.getItem("keahlian") || "-";

      const response = await fetch("/api/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          posisi: posisi || "Supervisor HRGA",
          pengalaman,
          keahlian,
        }),
      });

      const data = await response.json();
      setHasil(data.message);
    } catch (error: any) {
      setHasil(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">
        AI Cover Letter
      </h1>

      <input
        type="text"
        className="w-full max-w-xl p-3 rounded bg-white text-black"
        placeholder="Masukkan posisi yang dilamar"
        value={posisi}
        onChange={(e) => setPosisi(e.target.value)}
      />

      <button
        onClick={buatCoverLetter}
        className="bg-blue-600 px-5 py-3 rounded mt-5"
      >
        {loading ? "Membuat..." : "Buat Cover Letter AI"}
      </button>

      <div className="bg-slate-800 p-5 rounded mt-6 whitespace-pre-line min-h-[250px]">
        {hasil}
      </div>

      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="bg-slate-700 px-5 py-3 rounded mt-6"
      >
        Kembali ke Dashboard
      </button>
    </main>
  );
}