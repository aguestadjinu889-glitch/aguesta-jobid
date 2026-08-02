import { supabase } from "./supabase";

export async function applyJob(
  jobId: string,
  nama: string,
  email: string
) {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        job_id: jobId,
        user_id: user?.id,
        nama,
        email,
        status: "Menunggu",
      },
    ]);

  if (error) throw error;

  return data;
}