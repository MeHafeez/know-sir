import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 1500;
const MAX_RETRIES = 3;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिंदी) — use simple, natural spoken Hindi that a village resident would understand",
  te: "Telugu (తెలుగు) — use simple, natural spoken Telugu",
  ta: "Tamil (தமிழ்) — use simple, natural spoken Tamil",
  kn: "Kannada (ಕನ್ನಡ) — use simple, natural spoken Kannada",
  ml: "Malayalam (മലയാളം) — use simple, natural spoken Malayalam",
  mr: "Marathi (मराठी) — use simple, natural spoken Marathi",
  gu: "Gujarati (ગુજરાતી) — use simple, natural spoken Gujarati",
  pa: "Punjabi (ਪੰਜਾਬੀ) — use simple, natural spoken Punjabi",
  bn: "Bengali (বাংলা) — use simple, natural spoken Bengali",
  or: "Odia (ଓଡ଼ିଆ) — use simple, natural spoken Odia",
  as: "Assamese (অসমীয়া) — use simple, natural spoken Assamese",
  ur: "Urdu (اردو) — use simple, natural spoken Urdu",
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateChunk(
  cleanTexts: string[],
  locale: string,
  apiKey: string
): Promise<{ translations: string[]; fallback: boolean }> {
  const targetLang = LANGUAGE_NAMES[locale] || locale;
  const numbered = cleanTexts.map((t, i) => `[${i + 1}] ${t}`).join("\n");

  const systemPrompt = `You are a professional translator specializing in Indian languages for government information portals.
Translate the following numbered texts into ${targetLang}.

RULES:
- Keep the same numbering format [1], [2], etc.
- Use culturally natural language — NOT literal word-for-word translation
- For government terms like "voter registration", "electoral roll", "BLO", keep them understandable
- Do NOT translate proper nouns: form names (Form 6, Form 8), URLs, phone numbers (1950), ECI, EPIC
- Keep bullet points (•), arrows (→), emojis as-is
- Return ONLY the translated numbered list, nothing else`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: numbered },
        ],
        max_tokens: 4096,
        temperature: 0.2,
      }),
    });

    if (response.status === 429 && attempt < MAX_RETRIES) {
      await delay(2000 * (attempt + 1));
      continue;
    }

    if (!response.ok) {
      const errBody = await response.text().catch(() => "(unreadable)");
      console.error("Groq translate error:", response.status, errBody);
      return { translations: cleanTexts, fallback: true };
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";

    const translations: string[] = [...cleanTexts];
    const lines = raw.split("\n").filter((l: string) => l.trim());
    for (const line of lines) {
      const match = line.match(/^\[(\d+)\]\s*([\s\S]+)$/);
      if (match) {
        const idx = parseInt(match[1]) - 1;
        if (idx >= 0 && idx < translations.length) {
          translations[idx] = match[2].trim();
        }
      }
    }

    return { translations, fallback: false };
  }

  return { translations: cleanTexts, fallback: true };
}

export async function POST(req: NextRequest) {
  try {
    const { texts, locale } = await req.json();

    if (!texts || !Array.isArray(texts) || !locale) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const cleanTexts = texts.filter((t: unknown) => typeof t === "string" && t.trim().length > 0);
    if (cleanTexts.length === 0) {
      return NextResponse.json({ translations: texts });
    }

    if (locale === "en") {
      return NextResponse.json({ translations: texts });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ translations: texts, fallback: true });
    }

    const allTranslations: string[] = [];
    let hadFallback = false;

    for (let i = 0; i < cleanTexts.length; i += BATCH_SIZE) {
      const chunk = cleanTexts.slice(i, i + BATCH_SIZE);
      const { translations, fallback } = await translateChunk(chunk, locale, apiKey);
      allTranslations.push(...translations);
      if (fallback) hadFallback = true;

      if (i + BATCH_SIZE < cleanTexts.length) {
        await delay(BATCH_DELAY_MS);
      }
    }

    return NextResponse.json({
      translations: allTranslations,
      fallback: hadFallback || undefined,
    });
  } catch (err) {
    console.error("Translate route error:", err);
    return NextResponse.json({ translations: [], fallback: true }, { status: 200 });
  }
}
