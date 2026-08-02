"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Pelamar = {
  id: string;
  user_id: string;
  nama: string;
  email: string;
  telepon: string;
  pendidikan: string;
  pengalaman: string;
  keahlian: string;
  status: string;
  jobs?: {
    posisi: string;
    perusahaan: string;
  };
};

export default function AdminPage() {

  const [pelamar, setPelamar] = useState<Pelamar[]>([]);
  const [cari, setCari] = useState("");

  useEffect(() => {
    loadPelamar();
  }, []);

  async function loadPelamar() {

    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        jobs(
          posisi,
          perusahaan
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error.message);
      return;
    }

    setPelamar((data || []) as Pelamar[]);
  }

  async function updateStatus(id: string, status: string) {

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadPelamar();
  }

  async function lihatDokumen(user_id: string, jenis: string) {

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user_id)
      .ilike("file_type", jenis)
      .single();

    if (error) {
      alert(`${jenis} belum tersedia`);
      return;
    }

    const { data: urlData, error: urlError } =
      await supabase.storage
        .from("documents")
        .createSignedUrl(data.file_url, 3600);

    if (urlError) {
      alert(urlError.message);
      return;
    }

    window.open(urlData.signedUrl, "_blank");
  }

  return (

    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard Perusahaan
      </h1>

      <input
        type="text"
        placeholder="Cari nama, posisi atau perusahaan..."
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        className="border rounded-lg p-3 w-full mb-6"
      />

      <h2 className="text-xl font-bold mb-4">
        Daftar Pelamar
      </h2>

      {
        pelamar
          .filter((item) =>
            item.nama.toLowerCase().includes(cari.toLowerCase()) ||
            item.jobs?.posisi?.toLowerCase().includes(cari.toLowerCase()) ||
            item.jobs?.perusahaan?.toLowerCase().includes(cari.toLowerCase())
          )
          .map((item) => (
                        <div
              key={item.id}
              className="border rounded-xl p-5 mb-5"
            >
              <h3 className="text-xl font-bold">
                {item.nama}
              </h3>

              <p>Posisi: {item.jobs?.posisi}</p>
              <p>Perusahaan: {item.jobs?.perusahaan}</p>
              <p>Email: {item.email}</p>
              <p>Telepon: {item.telepon}</p>
              <p>Pendidikan: {item.pendidikan}</p>
              <p>Pengalaman: {item.pengalaman}</p>
              <p>Keahlian: {item.keahlian}</p>

              <div className="mt-4">
                <p className="font-bold mb-2">
                  Dokumen Pelamar
                </p>

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={() => lihatDokumen(item.user_id, "CV")}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    CV
                  </button>

                  <button
                    onClick={() => lihatDokumen(item.user_id, "Ijazah")}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Ijazah
                  </button>

                  <button
                    onClick={() => lihatDokumen(item.user_id, "Sertifikat")}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Sertifikat
                  </button>

                  <button
                    onClick={() => lihatDokumen(item.user_id, "Pengalaman")}
                    className="bg-green-600 text-white px-3 py-2 rounded"
                  >
                    Pengalaman
                  </button>

                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 font-semibold">
                  Status
                </p>

                <select
                  className="border rounded p-2"
                  value={item.status}
                  onChange={(e) =>
                    updateStatus(item.id, e.target.value)
                  }
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Interview">Interview</option>
                  <option value="Diterima">Diterima</option>
                  <option value="Ditolak">Ditolak</option>
                </select>
              </div>

            </div>
          ))
      }

    </main>

  );

}