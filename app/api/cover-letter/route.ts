import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { nama, posisi, pengalaman, keahlian } = await req.json();

    const prompt = `
Buatkan Cover Letter profesional dalam Bahasa Indonesia.

Nama: ${nama}
Posisi: ${posisi}
Pengalaman: ${pengalaman}
Keahlian: ${keahlian}

Gunakan bahasa formal, singkat, dan meyakinkan.
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    return NextResponse.json({
      message: response.output_text,
    });
  } catch (error: any) {
    console.error("OPENAI ERROR:", error);

    return NextResponse.json(
      {
        message: error?.message || "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
