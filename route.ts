import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  const body = await req.json();

  const { nama, pengalaman, keahlian } = body;

  const hasil = `
Yth. HRD Perusahaan,

Perkenalkan saya ${nama}.

Saya memiliki pengalaman kerja sebagai ${pengalaman}
dengan keahlian di bidang ${keahlian}.

Saya adalah pribadi yang disiplin, bertanggung jawab,
dan siap memberikan kontribusi terbaik bagi perusahaan.

Hormat saya,
${nama}
`;

  return NextResponse.json({
    message: hasil
  });
}
