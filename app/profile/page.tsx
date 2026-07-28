"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Dokumen = {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string;
};

export default function ProfilePage() {
  const [dokumen, setDokumen] = useState<Dokumen[]>([]);

  useEffect(() => {
    loadDokumen();
  }, []);

  async function loadDokumen() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setDokumen(data);
  }

  async function hapus(item: Dokumen) {
    const yakin = confirm("Hapus dokumen ini?");
    if (!yakin) return;

    await supabase.storage
      .from("documents")
      .remove([item.file_url]);

    await supabase
      .from("documents")
      .delete()
      .eq("id", item.id);

    loadDokumen();
  }

  function tampil(jenis: string) {
    const data = dokumen.filter(
      (d) => d.file_type === jenis
    );

    return (
      <div className="bg-slate-800 p-4 rounded-xl mb-4">
        <h2 className="text-xl font-bold mb-3">
          Jenis: {jenis}
        </h2>

        {data.length === 0 ? (
          <p className="text-gray-400">
            Belum ada file.
          </p>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="border-b border-slate-700 py-3"
            >
              <p className="font-semibold">
                Nama File:
              </p>

              <p>{item.file_name}</p>

              <br />

              <a
                href={`https://czsperfcuxfhshiwlosk.supabase.co/storage/v1/object/public/documents/${item.file_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                Lihat Dokumen
              </a>

              <br />
                            <p className="text-xs text-gray-400 break-all mt-2">
                {item.file_url}
              </p>

              <button
                onClick={() => hapus(item)}
                className="mt-4 bg-red-600 px-4 py-2 rounded"
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-8">
        📁 Dokumen Saya
      </h1>

      {tampil("KTP")}
      {tampil("SIM")}
      {tampil("Ijazah")}
      {tampil("Sertifikat")}
      {tampil("Pengalaman")}
      {tampil("CV")}

      <Link href="/dashboard">
        <button className="bg-blue-600 px-5 py-3 rounded mt-6">
          Kembali ke Dashboard
        </button>
      </Link>
    </main>
  );
}