"use client";

import { useState } from "react";

export default function JobsPage() {

  const [hasil, setHasil] = useState("");

  function cocokkanCV() {

    const nama = localStorage.getItem("nama") || "Pelamar";
    const pendidikan = localStorage.getItem("pendidikan") || "-";
    const pengalaman = localStorage.getItem("pengalaman") || "-";
    const keahlian = localStorage.getItem("keahlian") || "-";

    setHasil(`HASIL AI JOB MATCHING

Nama:
${nama}

Pendidikan:
${pendidikan}

Pengalaman:
${pengalaman}

Keahlian:
${keahlian}

=========================

REKOMENDASI PEKERJAAN

✅ Supervisor Mining
Kecocokan : 95%

✅ HRD
Kecocokan : 92%

✅ Supervisor Operasional
Kecocokan : 90%

Kesimpulan AI:

CV Anda sangat cocok untuk posisi Supervisor Mining karena pengalaman dan keahlian yang dimiliki sudah memenuhi kebutuhan perusahaan.`);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold text-blue-400 mb-8">
        Lowongan Kerja
      </h1>

      <div className="bg-slate-900 p-6 rounded-xl">

        <h2 className="text-2xl font-bold mb-2">
          Supervisor Mining
        </h2>

        <p>Perusahaan Tambang Indonesia</p>

        <p className="mb-5">
          Lokasi: Kalimantan
        </p>

        <button
          onClick={cocokkanCV}
          className="bg-blue-600 px-5 py-3 rounded"
        >
          Cocokkan dengan CV
        </button>

        {hasil && (
          <div className="bg-slate-800 p-5 rounded mt-6 whitespace-pre-line">
            {hasil}
          </div>
        )}

      </div>

      <button
        onClick={() => window.location.href = "/dashboard"}
        className="bg-slate-700 px-5 py-3 rounded mt-6"
      >
        Kembali ke Dashboard
      </button>

    </main>
  );
}
