"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jenis, setJenis] = useState("KTP");
  const [status, setStatus] = useState("");
  const [dokumen, setDokumen] = useState<string[]>([]);
  const [userId, setUserId] = useState("");

  async function cekUser() {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setUserId(data.user.id);
    }
  }

  async function loadDokumen() {
    if (!userId) return;

    const { data, error } = await supabase.storage
      .from("documents")
      .list(`${userId}/${jenis.toLowerCase()}`);

    if (error) {
      console.log(error);
      return;
    }

    setDokumen(data.map((item) => item.name));
  }

  useEffect(() => {
    cekUser();
  }, []);

  useEffect(() => {
    loadDokumen();
  }, [jenis, userId]);

  async function uploadFile() {
    if (!file) {
      setStatus("Pilih file dulu");
      return;
    }

    const fileName = file.name;

    const { error } = await supabase.storage
      .from("documents")
      .upload(
        `${userId}/${jenis.toLowerCase()}/${fileName}`,
        file
      );

    if (error) {
      setStatus("Upload gagal: " + error.message);
      return;
    }

    setStatus("Upload berhasil");
    setFile(null);
    loadDokumen();
  }

  async function hapusFile(nama: string) {
    await supabase.storage
      .from("documents")
      .remove([
        `${userId}/${jenis.toLowerCase()}/${nama}`
      ]);

    loadDokumen();
  }

  function lihatFile(nama: string) {
    const url = supabase.storage
      .from("documents")
      .getPublicUrl(
        `${userId}/${jenis.toLowerCase()}/${nama}`
      )
      .data.publicUrl;

    window.open(url, "_blank");
  }

  return (
    <main className="p-8">

      <h1 className="text-2xl font-bold mb-5">
        Upload Dokumen
      </h1>

      <select
        className="border p-2 mb-4"
        value={jenis}
        onChange={(e) => setJenis(e.target.value)}
      >
        <option>KTP</option>
        <option>SIM</option>
        <option>Ijazah</option>
        <option>CV</option>
        <option>Sertifikat</option>
      </select>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={uploadFile}
        className="bg-blue-600 text-white px-5 py-2 mt-4 rounded"
      >
        Upload
      </button>

      <p className="mt-3">
        {status}
      </p>

      <hr className="my-6" />

      <h2 className="text-xl font-bold">
        Dokumen Saya ({jenis})
      </h2>

      {dokumen.map((nama) => (
        <div
          key={nama}
          className="border p-3 mt-3 rounded"
        >
          <p>{nama}</p>

          <button
            onClick={() => lihatFile(nama)}
            className="bg-green-600 text-white px-3 py-1 rounded mr-2"
          >
            Lihat
          </button>

          <button
            onClick={() => hapusFile(nama)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Hapus
          </button>
        </div>
      ))}

    </main>
  );
}