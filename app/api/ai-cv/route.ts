import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
Analisa CV berikut dalam Bahasa Indonesia.

Nama: ${body.nama}
Pendidikan: ${body.pendidikan}
Pengalaman: ${body.pengalaman}
Keahlian: ${body.keahlian}

Berikan hasil:

Nilai CV: xx/100

Kelebihan:
- 

Kekurangan:
-

Saran:
-
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return NextResponse.json({
      message: response.output_text,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json({
      message: error.message,
    });
  }
}