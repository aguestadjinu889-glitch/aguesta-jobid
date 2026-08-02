"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  created_at: string;
  job_id: string;
  status: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setApplications(data || []);
    }

    setLoading(false);
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Lamaran Saya
      </h1>

      {loading && <p>Memuat data...</p>}

      {!loading && applications.length === 0 && (
        <div className="border rounded-lg p-5">
          Belum ada lamaran.
        </div>
      )}

      <div className="space-y-4">
        {applications.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-5 shadow-sm"
          >
            <p>
              <b>ID Lamaran:</b> {item.id}
            </p>

            <p>
              <b>ID Lowongan:</b> {item.job_id}
            </p>

            <p>
              <b>Status:</b> {item.status}
            </p>

            <p>
              <b>Tanggal:</b>{" "}
              {new Date(item.created_at).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}