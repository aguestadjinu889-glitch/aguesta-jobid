"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AICVPage() {

  const [hasil, setHasil] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  async function analisaCV() {

    setLoading(true);

    try {

      const {
        data:{user}
      } = await supabase.auth.getUser();


      if(!user){
        alert("Silakan login");
        return;
      }


      const {data:profile,error} = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id",user.id)
        .limit(1)
        .maybeSingle();


      if(error){
        alert(error.message);
        return;
      }


      const res = await fetch("/api/ai-cv",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          nama: profile?.full_name,

          pendidikan: profile?.education,

          pengalaman: profile?.experience,

          keahlian: profile?.keahlian || "Microsoft Office"

        })

      });


      const data = await res.json();

console.log("HASIL AI DETAIL:", JSON.stringify(data, null, 2));

setHasil(data);

      setHasil(data);


    }catch(error){

      alert("Gagal analisa CV");

    }


    setLoading(false);

  }



  return (

    <main className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-6">
        AI CV Analyzer
      </h1>


      <button
        onClick={analisaCV}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Menganalisa..." : "Analisa CV"}
      </button>



      {hasil && (

        <div className="border rounded-xl p-6 mt-8">

          <h2 className="text-2xl font-bold">
            Hasil Analisa AI
          </h2>


          <p className="text-xl font-bold mt-4">
            Skor CV : {hasil.score}/100
          </p>


          <h3 className="font-bold mt-4">
            Kelebihan
          </h3>

          <ul className="list-disc ml-6">

            {hasil.strengths?.map(
              (x:string,i:number)=>(
                <li key={i}>{x}</li>
              )
            )}

          </ul>


          <h3 className="font-bold mt-4">
            Kekurangan
          </h3>

          <ul className="list-disc ml-6">

            {hasil.weaknesses?.map(
              (x:string,i:number)=>(
                <li key={i}>{x}</li>
              )
            )}

          </ul>


          <h3 className="font-bold mt-4">
            Rekomendasi AI
          </h3>

          <p>
            {hasil.recommendation}
          </p>


        </div>

      )}


    </main>

  );

}