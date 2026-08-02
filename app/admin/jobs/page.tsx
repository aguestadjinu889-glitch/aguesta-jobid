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
  pendidikan: string;
  pengalaman: string;
  persyaratan: string;
  deskripsi: string;
  status: string;
};

export default function AdminJobsPage() {

  const kosong = {
    perusahaan: "",
    posisi: "",
    kategori: "",
    provinsi: "",
    kota: "",
    lokasi: "",
    tipe_pekerjaan: "",
    gaji_min: "",
    gaji_max: "",
    pendidikan: "",
    pengalaman: "",
    persyaratan: "",
    deskripsi: "",
    status: "Aktif"
  };


  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<any>(kosong);
  const [editId, setEditId] = useState<string | null>(null);
  const [daftarKota, setDaftarKota] = useState<string[]>([]);


  useEffect(() => {
    loadJobs();
  }, []);


  async function loadJobs(){

    const {data,error}=await supabase
      .from("jobs")
      .select("*")
      .order("created_at",{ascending:false});


    if(error){
      alert(error.message);
      return;
    }


    setJobs(data || []);

  }



  function handleChange(e:any){

  setForm({
    ...form,
    [e.target.name]: e.target.value
  });

}


function pilihProvinsi(e:any){

  const provinsi = e.target.value;

  setForm({
    ...form,
    provinsi: provinsi,
    kota: ""
  });


  const data = lokasiIndonesia.find(
    (item) => item.provinsi === provinsi
  );


  setDaftarKota(
    data ? data.kota : []
  );

}



  async function simpanJob(){

    const data = {
      ...form,
      gaji_min:Number(form.gaji_min),
      gaji_max:Number(form.gaji_max)
    };


    let result;


    if(editId){

      result = await supabase
        .from("jobs")
        .update(data)
        .eq("id",editId);

    }else{

      result = await supabase
        .from("jobs")
        .insert(data);

    }


    if(result.error){

      alert(result.error.message);
      return;

    }


    alert(
      editId
      ? "Lowongan berhasil diperbarui"
      : "Lowongan berhasil dibuat"
    );


    setForm(kosong);
    setEditId(null);

    loadJobs();

  }



  function editJob(job:Job){

    setEditId(job.id);

    setForm({
      perusahaan:job.perusahaan,
      posisi:job.posisi,
      kategori:job.kategori,
      provinsi:job.provinsi,
      kota:job.kota,
      lokasi:job.lokasi,
      tipe_pekerjaan:job.tipe_pekerjaan,
      gaji_min:job.gaji_min,
      gaji_max:job.gaji_max,
      pendidikan:job.pendidikan,
      pengalaman:job.pengalaman,
      persyaratan:job.persyaratan,
      deskripsi:job.deskripsi,
      status:job.status
    });

  }



  async function hapusJob(id:string){

    if(!confirm("Hapus lowongan ini?")) return;


    const {error}=await supabase
      .from("jobs")
      .delete()
      .eq("id",id);


    if(error){

      alert(error.message);
      return;

    }


    loadJobs();

  }



  return (

    <main className="max-w-6xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        Kelola Lowongan
      </h1>


      <div className="border rounded-xl p-6 mb-8">

        <h2 className="text-xl font-bold mb-4">
          {editId ? "Edit Lowongan" : "Tambah Lowongan Baru"}
        </h2>


    <input
name="perusahaan"
value={form.perusahaan}
onChange={handleChange}
placeholder="Nama Perusahaan"
className="border p-2 rounded w-full mb-3"
/>

<input
name="posisi"
value={form.posisi}
onChange={handleChange}
placeholder="Posisi"
className="border p-2 rounded w-full mb-3"
/>
<select
name="kategori"
value={form.kategori}
onChange={handleChange}
className="border p-2 rounded w-full mb-3"
>

<option value="">
Pilih Kategori
</option>

<option value="HR">
HR
</option>

<option value="Mining">
Mining
</option>

<option value="Driver">
Driver
</option>

<option value="IT">
IT
</option>

<option value="Administrasi">
Administrasi
</option>

</select>


<select
name="provinsi"
value={form.provinsi}
onChange={pilihProvinsi}
className="border p-2 rounded w-full mb-3"
>

<option value="">
Pilih Provinsi
</option>

{lokasiIndonesia.map((item)=>(
<option key={item.provinsi}>
{item.provinsi}
</option>
))}

</select>


<select
name="kota"
value={form.kota}
onChange={handleChange}
className="border p-2 rounded w-full mb-3"
>

<option value="">
Pilih Kota
</option>

{daftarKota.map((kota)=>(
<option key={kota}>
{kota}
</option>
))}

</select>


        <button
          onClick={simpanJob}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          {editId ? "Update Lowongan" : "Simpan Lowongan"}
        </button>


      </div>


      <h2 className="text-xl font-bold mb-4">
        Daftar Lowongan
      </h2>


      {jobs.map((job)=>(

        <div
          key={job.id}
          className="border rounded-xl p-5 mb-4"
        >

          <h3 className="text-xl font-bold">
            {job.posisi}
          </h3>

          <p>{job.perusahaan}</p>

          <p>
            {job.provinsi} - {job.kota}
          </p>

          <p>
            Status: {job.status}
          </p>


          <button
            onClick={()=>editJob(job)}
            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
          >
            Edit
          </button>


          <button
            onClick={()=>hapusJob(job.id)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Hapus
          </button>


        </div>

      ))}


    </main>

  );

}