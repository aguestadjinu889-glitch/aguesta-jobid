"use client";

import { useState } from "react";

export default function AICVPage() {
  const [hasil, setHasil] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisaCV() {
    console.log("Tombol diklik");
    setLoading(true);

    const nama = localStorage.getItem("nama") || "Pelamar";
    const pendidikan = localStorage.getItem("pendidikan") || "-";
    const pengalaman = localStorage.getItem("pengalaman") || "-";
    const keahlian = localStorage.getItem("keahlian") || "-";

    try {
      console.log("Masuk ke try");
      const res = await fetch("/api/ai-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          pendidikan,
          pengalaman,
          keahlian,
        }),
      });
console.log(res.status);
      const data = await res.json();
console.log(data);
      setHasil(data.message);
    } catch (error: any) {
      setHasil(error.message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold text-green-400 mb-8">
        AI CV Analyzer
      </h1>

      <button
        onClick={analisaCV}
        className="bg-green-600 px-6 py-3 rounded"
      >
        {loading ? "Menganalisa..." : "Analisa CV Dengan AI"}
      </button>

      <div className="bg-slate-800 p-5 rounded mt-6 whitespace-pre-line min-h-[300px]">
        {hasil}
      </div>

      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="bg-slate-700 px-6 py-3 rounded mt-6"
      >
        Kembali ke Dashboard
      </button>
    </main>
  );
}
