"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lamaran = {
  id: string;
  status: string;
  created_at: string;
  jobs?: {
    posisi: string;
    perusahaan: string;
    provinsi: string;
    kota: string;
  };
};

export default function LamaranPage() {
  const [data, setData] = useState<Lamaran[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("applications")
      .select(`
        id,
        status,
        created_at,
        jobs(
          posisi,
          perusahaan,
          provinsi,
          kota
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setData((data as Lamaran[]) || []);
  }

  function warnaStatus(status: string) {
    switch (status) {
      case "Diterima":
        return "bg-green-600";
      case "Interview":
        return "bg-blue-600";
      case "Diproses":
        return "bg-yellow-500";
      case "Ditolak":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Riwayat Lamaran Saya
      </h1>

      {data.length === 0 && (
        <p>Belum ada lamaran.</p>
      )}

      {data.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-5 mb-5"
        >
          <h2 className="text-xl font-bold">
            {item.jobs?.posisi}
          </h2>

          <p>
            {item.jobs?.perusahaan}
          </p>

          <p>
            {item.jobs?.provinsi} - {item.jobs?.kota}
          </p>

          <p className="mt-3">
            Tanggal:
            {" "}
            {new Date(item.created_at).toLocaleDateString("id-ID")}
          </p>

          <span
            className={`inline-block mt-4 text-white px-4 py-2 rounded ${warnaStatus(item.status)}`}
          >
            {item.status}
          </span>
        </div>
      ))}
    </main>
  );
}