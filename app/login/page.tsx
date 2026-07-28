"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">
          Login Aguesta AI Job
        </h1>

        <div className="space-y-4">

          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <button
            onClick={login}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"
          >
            Login
          </button>

        </div>

        <p className="text-center text-gray-400 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Daftar
          </Link>
        </p>

      </div>

    </main>
  );
}