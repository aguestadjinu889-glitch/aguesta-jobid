"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HRPage() {

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  async function loadApplications() {

    const { data: apps, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });


    if (error) {
      console.log(error);
      return;
    }


    const result:any[] = [];


    for (const app of apps || []) {

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", app.user_id)
        .single();


      const { data: documents } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", app.user_id);


      result.push({
        ...app,
        profile,
        documents
      });

    }


    setApplications(result);
    setLoading(false);

  }



  useEffect(() => {

    loadApplications();

  }, []);



  async function updateStatus(id:string,status:string){

    const { error } = await supabase
      .from("applications")
      .update({status})
      .eq("id", id);


    if(error){

      alert(error.message);
      return;

    }


    loadApplications();

  }



  function lihatDokumen(url:string){

    window.open(url,"_blank");

  }



  function namaDokumen(doc:any){

    if(doc.file_type==="CV"){
      return "CV";
    }

    if(doc.file_type==="image/jpeg"){
      return "Foto";
    }

    return doc.file_type;

  }



  if(loading){

    return (
      <main className="p-8">
        Memuat data pelamar...
      </main>
    );

  }



  return (

    <main className="max-w-6xl mx-auto p-8">


      <h1 className="text-3xl font-bold mb-8">
        Dashboard HR - Pelamar
      </h1>



      {
        applications.map((item)=>(

          <div
            key={item.id}
            className="border rounded-xl p-5 mb-5 shadow"
          >


            <h2 className="text-xl font-bold">
              Pelamar
            </h2>


            <p>
              Nama Pelamar: {item.profile?.full_name || "-"}
            </p>


            <p>
              Email: {item.email || "-"}
            </p>


            <p>
              Telepon: {item.profile?.phone || "-"}
            </p>


            <p>
              Pendidikan: {item.profile?.education || "-"}
            </p>


            <p>
              Pengalaman: {item.profile?.experience || "-"}
            </p>



            <h3 className="font-bold mt-4">
              Dokumen:
            </h3>



            {
              (item.documents || [])
              .map((doc:any)=>(

                <button
                  key={doc.id}
                  onClick={()=>lihatDokumen(doc.file_url)}
                  className="block mt-2 bg-purple-600 text-white px-4 py-2 rounded"
                >

                  Lihat {namaDokumen(doc)}

                </button>

              ))
            }



            <p className="mt-4">
              Status:
              <b> {item.status || "Menunggu"}</b>
            </p>



            <div className="flex gap-3 mt-4">


              <button
                onClick={()=>updateStatus(item.id,"Interview")}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Interview
              </button>


              <button
                onClick={()=>updateStatus(item.id,"Diterima")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Diterima
              </button>


              <button
                onClick={()=>updateStatus(item.id,"Ditolak")}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Ditolak
              </button>


            </div>


          </div>

        ))
      }


    </main>

  );

}