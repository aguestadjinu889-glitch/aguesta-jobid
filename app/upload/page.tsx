"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Doc = {
  id: number;
  user_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  nama_file: string;
  kategori: string;
};

export default function UploadPage() {
  const [userId, setUserId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [kategori, setKategori] = useState("KTP");
  const [status, setStatus] = useState("");
  const [docs, setDocs] = useState<Doc[]>([]);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);
    load(user.id);
  }

  async function load(uid: string) {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (data) {
      setDocs(data as Doc[]);
    }
  }

  async function upload() {
    if (!file) {
      setStatus("Pilih file dulu");
      return;
    }

    const fileName = Date.now() + "-" + file.name;

    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (error) {
      setStatus(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    await supabase.from("documents").insert({
      user_id: userId,
      file_name: fileName,
      file_type: file.type,
      file_url: data.publicUrl,
      nama_file: file.name,
      kategori: kategori,
    });

    setStatus("Upload berhasil");
    setFile(null);
    load(userId);
  }

  async function hapus(item: Doc) {
    await supabase.storage
      .from("documents")
      .remove([item.file_name]);

    await supabase
      .from("documents")
      .delete()
      .eq("id", item.id);

    load(userId);
  }

  return (
    <main className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Upload Dokumen
      </h1>

      <div className="border p-4 rounded-lg bg-gray-50">

        <select
          className="w-full border rounded-lg p-2 mb-4 bg-white text-gray-700"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          <option>KTP</option>
          <option>Pas Foto</option>
          <option>SIM</option>
          <option>Ijazah</option>
          <option>Sertifikat</option>
          <option>CV</option>
          <option>KK</option>
          <option>Kartu Pencari Kerja</option>
        </select>

        <input
          type="file"
          className="
          block w-full border rounded-lg p-2 bg-white text-gray-700
          file:bg-blue-600 file:text-white
          file:px-4 file:py-2 file:rounded-lg
          "
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        <button
          onClick={upload}
          className="
          mt-4 bg-blue-600 text-white
          px-6 py-2 rounded-lg
          "
        >
          Upload
        </button>

        <p className="mt-3 text-gray-700">
          {status}
        </p>

      </div>


      <hr className="my-6" />


      <h2 className="text-2xl font-bold mb-4">
        Dokumen Saya
      </h2>


      {docs.map((item) => (
        <div
          key={item.id}
          className="
          border p-4 mb-3 rounded-lg
          flex justify-between items-center
          "
        >

          <div>
            <p className="font-bold text-blue-700">
              {item.kategori}
            </p>

            <p>
              {item.nama_file}
            </p>
          </div>


          <div className="flex gap-2">

            <a
              href={item.file_url}
              target="_blank"
              className="
              bg-green-600 text-white
              px-3 py-1 rounded
              "
            >
              Lihat
            </a>

            <button
              onClick={() => hapus(item)}
              className="
              bg-red-600 text-white
              px-3 py-1 rounded
              "
            >
              Hapus
            </button>

          </div>

        </div>
      ))}

    </main>
  );
}