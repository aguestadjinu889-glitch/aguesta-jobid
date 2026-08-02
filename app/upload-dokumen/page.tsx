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

  const [file,setFile] = useState<File | null>(null);
  const [jenis,setJenis] = useState("KTP");
  const [docs,setDocs] = useState<Dokumen[]>([]);
  const [loading,setLoading] = useState(false);
  const [status,setStatus] = useState("");


  useEffect(()=>{
    loadDocuments();
  },[]);



  async function loadDocuments(){

    const {
      data:{user}
    } = await supabase.auth.getUser();


    if(!user) return;


    const {data,error}=await supabase
      .from("documents")
      .select("*")
      .eq("user_id",user.id)
      .order("created_at",{ascending:false});


    if(error){
      console.log(error);
      return;
    }


    setDocs((data || []) as Dokumen[]);

  }



  async function upload(){

    if(!file){
      setStatus("Pilih file terlebih dahulu");
      return;
    }


    setLoading(true);
    setStatus("");


    const {
      data:{user}
    }=await supabase.auth.getUser();


    if(!user){
      setStatus("Silakan login");
      setLoading(false);
      return;
    }



    const namaFile=`${Date.now()}-${file.name}`;

    const path=`${jenis.toLowerCase()}/${namaFile}`;



    const {error:uploadError}=await supabase.storage
      .from("documents")
      .upload(path,file);



    if(uploadError){
      setStatus(uploadError.message);
      setLoading(false);
      return;
    }



    const {error:insertError}=await supabase
      .from("documents")
      .insert({

        user_id:user.id,
        file_name:namaFile,
        file_type:jenis,
        file_url:path

      });



    if(insertError){

      setStatus(insertError.message);
      setLoading(false);
      return;

    }



    setStatus("✓ Upload berhasil");
    setFile(null);

    await loadDocuments();

    setLoading(false);

  }




  async function lihat(item:Dokumen){

    const {data,error}=await supabase.storage
      .from("documents")
      .createSignedUrl(item.file_url,3600);


    if(error){
      setStatus(error.message);
      return;
    }


    window.open(data.signedUrl,"_blank");

  }



  return (

    <main className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Upload Dokumen
      </h1>


      <div className="border p-4 rounded-lg bg-gray-50">


        <select
          className="border p-2 rounded w-full mb-4 bg-white text-black"
          value={jenis}
          onChange={(e)=>setJenis(e.target.value)}
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
          className="border p-2 rounded w-full mb-4 bg-white text-black"
          onChange={(e)=>
            setFile(e.target.files?.[0] || null)
          }
        />



        <button
          onClick={upload}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >

          {loading ? "Uploading..." : "Upload"}

        </button>



        {status && (
          <p className="mt-3">
            {status}
          </p>
        )}


      </div>



      <h2 className="text-2xl font-bold mt-8 mb-4">
        Dokumen Saya
      </h2>



      {
        docs.map((item)=>(

          <div
            key={item.id}
            className="border p-4 mb-3 rounded flex justify-between"
          >

            <div>

              <b>{item.file_type}</b>
              <br/>
              {item.file_name}

            </div>


            <button
              onClick={()=>lihat(item)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Lihat
            </button>


          </div>

        ))
      }


    </main>

  );

}