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
      data:{user},
    } = await supabase.auth.getUser();


    if(!user){
      window.location.href="/login";
      return;
    }


    setNama(user.email || "");


    const {count}=await supabase
      .from("documents")
      .select("*",{
        count:"exact",
        head:true,
      })
      .eq("user_id",user.id);


    setJumlahDokumen(count || 0);

  }



  return (

    <main className="min-h-screen bg-slate-950 text-white p-10">


      <h1 className="text-4xl font-bold text-blue-400 mb-2">
        Dashboard Aguesta AI Job
      </h1>


      <p className="text-gray-300 mb-8">
        {nama}
      </p>



      {/* AIVA AI ASSISTANT */}

      <div className="bg-gradient-to-r from-blue-700 to-purple-700 p-6 rounded-2xl mb-8 shadow-xl">


        <div className="flex items-center gap-4">

          <div className="text-5xl">
            🤖
          </div>


          <div>

            <h2 className="text-3xl font-bold">
              AIVA
            </h2>

            <p className="text-blue-100">
              Aguesta Intelligent Virtual Assistant
            </p>

          </div>


        </div>



        <p className="mt-5 text-lg">
          Halo 👋 Saya AIVA, asisten AI Aguesta.
          Saya membantu Anda menemukan pekerjaan,
          menganalisa CV, dan mempersiapkan karier.
        </p>



        <div className="grid md:grid-cols-3 gap-3 mt-5">


          <Link href="/ai-cv">

            <button className="bg-white text-blue-700 px-4 py-3 rounded-xl w-full font-bold">

              📄 Analisa CV

            </button>

          </Link>



          <Link href="/jobs">

            <button className="bg-white text-blue-700 px-4 py-3 rounded-xl w-full font-bold">

              🎯 Cari Kerja

            </button>

          </Link>



          <Link href="/interview">

            <button className="bg-white text-blue-700 px-4 py-3 rounded-xl w-full font-bold">

              🎤 Interview AI

            </button>

          </Link>


        </div>


      </div>





      <div className="grid gap-5">


        <Link href="/cv">

          <div className="bg-slate-800 p-5 rounded-xl">

            📄 CV Saya

          </div>

        </Link>



        <Link href="/jobs">

          <div className="bg-slate-800 p-5 rounded-xl">

            💼 Lowongan Cocok

          </div>

        </Link>



        <Link href="/profile">

          <div className="bg-slate-800 p-5 rounded-xl">

            👤 Profil Saya

          </div>

        </Link>



        <Link href="/upload">

          <div className="bg-slate-800 p-5 rounded-xl">

            📁 Dokumen Saya

            <p className="text-blue-400 mt-2">

              Total Dokumen : {jumlahDokumen}

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