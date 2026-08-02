"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {

  const [form, setForm] = useState({
    nama: "",
    email: "",
    telepon: "",
    pendidikan: "",
    pengalaman: "",
    keahlian: "",
  });


  useEffect(() => {
    loadProfile();
  }, []);


  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) return;


    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();


    if (data) {
      setForm({
        nama: data.nama || "",
        email: data.email || "",
        telepon: data.telepon || "",
        pendidikan: data.pendidikan || "",
        pengalaman: data.pengalaman || "",
        keahlian: data.keahlian || "",
      });
    }

  }



  async function saveProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();


    if (!user) {
      alert("Silakan login");
      return;
    }


    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        ...form,
      });


    if (error) {
      alert(error.message);
      return;
    }


    alert("Profil berhasil disimpan.");

  }



  return (
    <main className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Profil Saya
      </h1>


      <div className="space-y-4">


        <input
          className="w-full border p-3 rounded"
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({...form, nama:e.target.value})}
        />


        <input
          className="w-full border p-3 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({...form, email:e.target.value})}
        />


        <input
          className="w-full border p-3 rounded"
          placeholder="Telepon"
          value={form.telepon}
          onChange={(e) => setForm({...form, telepon:e.target.value})}
        />


        <input
          className="w-full border p-3 rounded"
          placeholder="Pendidikan"
          value={form.pendidikan}
          onChange={(e) => setForm({...form, pendidikan:e.target.value})}
        />


        <input
          className="w-full border p-3 rounded"
          placeholder="Pengalaman"
          value={form.pengalaman}
          onChange={(e) => setForm({...form, pengalaman:e.target.value})}
        />


        <input
          className="w-full border p-3 rounded"
          placeholder="Keahlian"
          value={form.keahlian}
          onChange={(e) => setForm({...form, keahlian:e.target.value})}
        />


        <button
          onClick={saveProfile}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Simpan Profil
        </button>


      </div>

    </main>
  );
}