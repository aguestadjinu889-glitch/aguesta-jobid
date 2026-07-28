import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = `
Anda adalah HRD profesional.

Pertanyaan:
${body.soal}

Jawaban Pelamar:
${body.jawaban}

Berikan hasil:

Nilai Interview : xx/100

Kelebihan:
- ...

Kekurangan:
- ...

Saran:
- ...
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
      message: String(error),
    });
  }
}