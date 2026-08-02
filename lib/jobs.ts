import { supabase } from "./supabase";

export async function getJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "Aktif")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}
