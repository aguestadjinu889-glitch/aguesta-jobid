"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DocumentsPage() {

  const [nama, setNama] = useState("");
  const [dokumen, setDokumen] = useState<any>({});


  useEffect(() => {

    setNama(localStorage.getItem("nama") || "-");

    const data = JSON.parse(
      localStorage.getItem("dokumen") || "{}"
    );

    setDokumen(data);

  }, []);


  function tampil(item:string) {

    if(Array.isArray(dokumen[item])) {

      return dokumen[item].map((file:string)=>(
        <p key={file} className="text-green-400">
          ✔ {file}
        </p>
      ));

    }

    if(dokumen[item]) {

      return (
        <p className="text-green-400">
          ✔ {dokumen[item]}
        </p>
      );

    }

    return (
      <p className="text-gray-400">
        Belum ada file
      </p>
    );

  }


  return (

    <main className="min-h-screen bg-slate-950 text-white p-10">


      <h1 className="text-4xl font-bold text-blue-400 mb-8">
        📁 Dokumen Saya
      </h1>


      <div className="bg-slate-900 p-6 rounded-xl space-y-5">


        <p className="text-xl">
          <b>Nama:</b> {nama}
        </p>


        <div className="grid gap-4">


          <div className="bg-slate-800 p-4 rounded">
            <b>KTP</b>
            {tampil("KTP")}
          </div>


          <div className="bg-slate-800 p-4 rounded">
            <b>SIM A / SIM C</b>
            {tampil("SIM")}
          </div>


          <div className="bg-slate-800 p-4 rounded">
            <b>Ijazah</b>
            {tampil("Ijazah")}
          </div>


          <div className="bg-slate-800 p-4 rounded">
            <b>Sertifikat</b>
            {tampil("Sertifikat")}
          </div>


          <div className="bg-slate-800 p-4 rounded">
            <b>Surat Pengalaman Kerja</b>
            {tampil("Pengalaman")}
          </div>


          <div className="bg-slate-800 p-4 rounded">
            <b>CV PDF</b>
            {tampil("CV")}
          </div>


        </div>


      </div>


      <Link href="/dashboard">

        <button className="bg-blue-600 px-5 py-3 rounded mt-6">
          Kembali ke Dashboard
        </button>

      </Link>


    </main>

  );

}
