import "server-only";

import {
  aiTutorResponseSchema,
  type AiTutorResponse,
} from "@/lib/api/contracts/ai-tutor";

const systemPrompt = `Anda adalah SQLens Tutor. Anda TIDAK mengeksekusi SQL dan TIDAK menyatakan query valid tanpa hasil SQL engine. Beri penjelasan pendidikan SQL dalam Bahasa Indonesia. Kembalikan JSON saja dengan explanation, hint, sqlConcept, reasoning (array 1-5 langkah).`;

export async function askAiTutor(
  prompt: string,
): Promise<{ response?: AiTutorResponse; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.SQLENS_AI_MODEL;
  if (!apiKey || !model)
    return { error: "AI Tutor belum dikonfigurasi oleh server." };
  const endpoint =
    process.env.SQLENS_AI_BASE_URL ||
    "https://openrouter.ai/api/v1/chat/completions";
  const isOpenRouter = endpoint.includes("openrouter.ai");

  try {
    const requestBody: Record<string, unknown> = {
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt.slice(0, 2_000) },
      ],
    };

    if (isOpenRouter) {
      requestBody.provider = { sort: "throughput" };
    }

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
    const body: unknown = await upstream.json().catch(() => null);
    const content =
      typeof body === "object" && body !== null
        ? (body as { choices?: Array<{ message?: { content?: unknown } }> })
            .choices?.[0]?.message?.content
        : undefined;
    if (!upstream.ok || typeof content !== "string")
      return { error: "AI Tutor tidak dapat merespons saat ini." };

    // Bersihkan format markdown jika model membungkusnya dengan ```json ... ```
    let cleanJson = content.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "");
    }

    const parsedJson: unknown = JSON.parse(cleanJson);
    const parsed = aiTutorResponseSchema.safeParse(parsedJson);
    return parsed.success
      ? { response: parsed.data }
      : {
          error:
            "Respons AI Tutor tidak memenuhi format pembelajaran yang aman.",
        };
  } catch {
    return { error: "AI Tutor tidak dapat dihubungi saat ini." };
  }
}
