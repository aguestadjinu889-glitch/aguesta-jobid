"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [nama, setNama] = useState("");
  const [jumlahDokumen, setJumlahDokumen] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setNama(user.email || "");

      const { count } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });

      setJumlahDokumen(count || 0);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold text-blue-400 mb-2">
        Dashboard Aguesta AI Job
      </h1>

      <p className="text-gray-300 mb-8">
        {nama}
      </p>

      <div className="grid gap-5">

        <Link href="/cv">
          <div className="bg-slate-800 p-5 rounded-xl">
            📄 CV Saya
            <p className="text-gray-400">
              Buat dan kelola CV Anda
            </p>
          </div>
        </Link>

        <Link href="/jobs">
          <div className="bg-slate-800 p-5 rounded-xl">
            💼 Lowongan Cocok
            <p className="text-gray-400">
              AI menemukan pekerjaan sesuai profil
            </p>
          </div>
        </Link>

        <Link href="/interview">
          <div className="bg-slate-800 p-5 rounded-xl">
            🎤 Interview
            <p className="text-gray-400">
              Latihan interview dengan AI
            </p>
          </div>
        </Link>

        <Link href="/profile">
          <div className="bg-slate-800 p-5 rounded-xl">
            👤 Profil Saya
          </div>
        </Link>

        <Link href="/upload-dokumen">
          <div className="bg-slate-800 p-5 rounded-xl">
            📁 Dokumen Saya

            <p className="text-gray-400">
              KTP, SIM, Ijazah, Sertifikat, CV
            </p>

            <p className="text-blue-400 mt-2">
              Total dokumen: {jumlahDokumen}
            </p>
          </div>
        </Link>

        <Link href="/ai-cv">
          <div className="bg-slate-800 p-5 rounded-xl">
            🤖 AI CV Analyzer
          </div>
        </Link>

      </div>

    </main>
  );
}