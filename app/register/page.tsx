"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function daftar() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nama,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Pendaftaran berhasil. Silakan cek email untuk verifikasi akun.");

    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-8">
          Daftar Aguesta AI Job
        </h1>

        <div className="space-y-4">
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            type="text"
            placeholder="Nama Lengkap"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <button
            onClick={daftar}
            className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg"
          >
            Daftar
          </button>
        </div>

        <p className="text-center text-gray-400 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}