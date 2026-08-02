"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { lokasiIndonesia } from "@/app/data/lokasi";

type Job = {
  id: string;
  perusahaan: string;
  posisi: string;
  kategori: string;
  provinsi: string;
  kota: string;
  lokasi: string;
  tipe_pekerjaan: string;
  gaji_min: number;
  gaji_max: number;
  deskripsi: string;
  status: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [lamaranSaya, setLamaranSaya] = useState<string[]>([]);
  const [provinsiFilter, setProvinsiFilter] = useState("");
  const [kotaFilter, setKotaFilter] = useState("");
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [daftarKota, setDaftarKota] = useState<string[]>([]);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    loadJobs();
  }, [provinsiFilter, kotaFilter, kategoriFilter, search]);

  async function loadJobs() {
    try {
      setLoading(true);

      let query = supabase
        .from("jobs")
        .select("*")
        .eq("status", "Aktif");
<input
  type="text"
  placeholder="Cari posisi pekerjaan..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="border p-3 rounded w-full mb-4"
/>
      if (provinsiFilter) query = query.eq("provinsi", provinsiFilter);
      if (kotaFilter) query = query.eq("kota", kotaFilter);
      if (kategoriFilter) query = query.eq("kategori", kategoriFilter);
if (search) {
  query = query.ilike("posisi", `%${search}%`);
}
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        return;
      }

      setJobs(data || []);

      const {
        data: { user },
      } = await supabase.auth.getUser();
if (user) {
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  setProfile(profileData);
}
      if (!user) {
        setLamaranSaya([]);
        return;
      }

      const { data: applicationsData, error: applicationsError } = await supabase
        .from("applications")
        .select("job_id")
        .eq("user_id", user.id);

      if (applicationsError) {
        alert(applicationsError.message);
        return;
      }

      setLamaranSaya((applicationsData || []).map((item) => item.job_id));
    } catch (err: any) {
      alert(err?.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }

  function pilihProvinsi(e: any) {
    const provinsi = e.target.value;

    setProvinsiFilter(provinsi);
    setKotaFilter("");

    const data = lokasiIndonesia.find((item) => item.provinsi === provinsi);
    setDaftarKota(data ? data.kota : []);
  }
function hitungMatch(job: Job) {
  if (!profile) return 50;

  let skor = 50;

  if (
    profile.pengalaman
      ?.toLowerCase()
      .includes(job.kategori.toLowerCase())
  ) {
    skor += 20;
  }

  if (
    profile.keahlian
      ?.toLowerCase()
      .includes(job.kategori.toLowerCase())
  ) {
    skor += 20;
  }

  if (profile.provinsi === job.provinsi) {
    skor += 5;
  }

  if (profile.kota === job.kota) {
    skor += 5;
  }

  return Math.min(skor, 100);
}
  async function applyJob(jobId: string) {
    if (lamaranSaya.includes(jobId)) return;

    try {
      setApplyingJobId(jobId);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Silakan login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        alert(profileError.message);
        return;
      }

      const { error } = await supabase.from("applications").insert({
        user_id: user.id,
        job_id: jobId,
        nama: profileData?.nama || "",
        email: profileData?.email || "",
        telepon: profileData?.telepon || "",
        pendidikan: profileData?.pendidikan || "",
        pengalaman: profileData?.pengalaman || "",
        keahlian: profileData?.keahlian || "",
        status: "Menunggu",
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Lamaran berhasil dikirim");
      await loadJobs();
    } catch (err: any) {
      alert(err?.message || "Terjadi kesalahan saat melamar");
    } finally {
      setApplyingJobId(null);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lowongan Kerja</h1>

      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <select
          value={provinsiFilter}
          onChange={pilihProvinsi}
          className="border p-3 rounded"
        >
          <option value="">Semua Provinsi</option>
          {lokasiIndonesia.map((item) => (
            <option key={item.provinsi} value={item.provinsi}>
              {item.provinsi}
            </option>
          ))}
        </select>

        <select
          value={kotaFilter}
          onChange={(e) => setKotaFilter(e.target.value)}
          className="border p-3 rounded"
        >
          <option value="">Semua Kota</option>
          {daftarKota.map((kota) => (
            <option key={kota} value={kota}>
              {kota}
            </option>
          ))}
        </select>

        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="border p-3 rounded"
        >
          <option value="">Semua Kategori</option>
          <option value="HR">HR</option>
          <option value="Mining">Mining</option>
          <option value="Driver">Driver</option>
          <option value="IT">IT</option>
          <option value="Administrasi">Administrasi</option>
        </select>
      </div>

      {loading && <p>Memuat data...</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-gray-600">Belum ada lowongan yang cocok.</p>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        {jobs.map((job) => (
          <div key={job.id} className="border rounded-xl p-5">
            <h2 className="text-xl font-bold">{job.posisi}</h2>
            <p>Perusahaan: {job.perusahaan}</p>
            <p>Lokasi: {job.provinsi} - {job.kota}</p>
            <p>Kategori: {job.kategori}</p>

            <div className="mt-2 mb-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                🤖 AI Match: {hitungMatch(job)}%
              </span>
            </div>

            <p>
              Gaji: Rp {job.gaji_min?.toLocaleString("id-ID")} - Rp{" "}
              {job.gaji_max?.toLocaleString("id-ID")}
            </p>

            <p>{job.deskripsi}</p>

            {lamaranSaya.includes(job.id) ? (
              <button disabled className="mt-5 bg-gray-500 text-white px-5 py-2 rounded">
                Sudah Dilamar
              </button>
            ) : (
              <button
                onClick={() => applyJob(job.id)}
                disabled={applyingJobId === job.id}
                className="mt-5 bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-70"
              >
                {applyingJobId === job.id ? "Mengirim..." : "Lamar Sekarang"}
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}