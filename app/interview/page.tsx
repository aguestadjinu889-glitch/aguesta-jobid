"use client";

import { useState } from "react";

export default function InterviewPage() {
  const [soal] = useState(
    "Ceritakan pengalaman kerja Anda secara singkat."
  );

  const [jawaban, setJawaban] = useState("");
  const [hasil, setHasil] = useState("");
  const [loading, setLoading] = useState(false);

  async function analisa() {
    setLoading(true);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          soal,
          jawaban,
        }),
      });

      const data = await res.json();
      setHasil(data.message);
    } catch (e: any) {
      setHasil(e.message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold text-purple-400 mb-8">
        AI Interview
      </h1>

      <div className="bg-slate-800 p-5 rounded mb-6">
        <b>Pertanyaan Interview</b>
        <br /><br />
        {soal}
      </div>

      <textarea
        className="w-full h-40 p-4 rounded bg-white text-black"
        value={jawaban}
        onChange={(e) => setJawaban(e.target.value)}
        placeholder="Ketik jawaban Anda..."
      />

      <br /><br />

      <button
        onClick={analisa}
        className="bg-purple-600 px-6 py-3 rounded"
      >
        {loading ? "Menganalisa..." : "Analisa Jawaban Dengan AI"}
      </button>

      <div className="bg-slate-800 p-5 rounded mt-6 whitespace-pre-line min-h-[250px]">
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