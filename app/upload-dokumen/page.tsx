"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Dokumen = {
  id: number;
  user_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  created_at: string;
};

export default function UploadDokumen() {
  const [file, setFile] = useState<File | null>(null);
  const [jenis, setJenis] = useState("KTP");
  const [docs, setDocs] = useState<Dokumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Load error:", error);
        return;
      }

      if (data) {
        setDocs(data as Dokumen[]);
      }
    } catch (error) {
      console.error("Load error:", error);
    }
  }

  async function upload() {
    if (!file) {
      setStatus("Pilih file terlebih dahulu");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("Silakan login");
        setLoading(false);
        return;
      }

      const folder = jenis.toLowerCase();
      const namaFile = `${Date.now()}-${file.name}`;
      const path = `${folder}/${namaFile}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file);

      if (uploadError) {
        setStatus(`Error upload: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("documents").insert({
        user_id: user.id,
        file_name: namaFile,
        file_type: jenis,
        file_url: path,
      });

      if (insertError) {
        setStatus(`Error saving: ${insertError.message}`);
        setLoading(false);
        return;
      }

      setStatus("✓ Upload berhasil");
      setFile(null);
      await loadDocuments();
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Upload gagal");
    } finally {
      setLoading(false);
    }
  }

  async function lihat(item: Dokumen) {
    try {
      let filePath = item.file_url;

      if (filePath.includes("http")) {
        const url = new URL(filePath);
        filePath = decodeURIComponent(
          url.pathname.split("/object/public/documents/")[1] || ""
        );
      }

      if (!filePath) {
        setStatus("Path file tidak valid");
        return;
      }

      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(filePath, 3600);

      if (error) {
        setStatus(`Error: ${error.message}`);
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      } else {
        setStatus("URL tidak dapat dibuat");
      }
    } catch (error) {
      console.error("Lihat error:", error);
      setStatus("Gagal membuka file");
    }
  }

  async function hapus(item: Dokumen) {
    if (!confirm("Hapus dokumen ini?")) return;

    setLoading(true);
    setStatus("");

    try {
      let filePath = item.file_url;

      if (filePath.includes("http")) {
        const url = new URL(filePath);
        filePath = decodeURIComponent(
          url.pathname.split("/object/public/documents/")[1] || ""
        );
      }
console.log("FILE PATH:", filePath);
      const { error: deleteStorageError } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      if (deleteStorageError) {
        setStatus(`Error delete file: ${deleteStorageError.message}`);
        setLoading(false);
        return;
      }

      const { error: deleteDbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", item.id);

      if (deleteDbError) {
        setStatus(`Error delete record: ${deleteDbError.message}`);
        setLoading(false);
        return;
      }

      setStatus("✓ Dokumen berhasil dihapus");
      await loadDocuments();
    } catch (error) {
      console.error("Hapus error:", error);
      setStatus("Gagal menghapus dokumen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Upload Dokumen</h1>

      <div className="border p-4 rounded-lg bg-gray-50 mb-6">
        <select
          className="border p-2 rounded w-full mb-4 bg-white"
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
        >
          <option>KTP</option>
          <option>SIM</option>
          <option>Ijazah</option>
          <option>Sertifikat</option>
          <option>Pengalaman</option>
          <option>CV</option>
        </select>

        <input
          type="file"
          className="border p-2 rounded w-full mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={upload}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {status && (
          <p className="mt-3 text-gray-700">
            {status}
          </p>
        )}
      </div>

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Dokumen Saya</h2>

      {docs.length === 0 ? (
        <p className="text-gray-500">Belum ada dokumen</p>
      ) : (
        docs.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4 mb-3 flex justify-between items-center"
          >
            <div>
              <b>{item.file_type}</b>
              <br />
              {item.file_name}
              <br />
              <small className="text-xs text-gray-500 break-all">
                {item.file_url}
              </small>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => lihat(item)}
                disabled={loading}
                className="bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
              >
                Lihat
              </button>

              <button
                onClick={() => hapus(item)}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded disabled:bg-gray-400"
              >
                Hapus
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}