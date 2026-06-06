import { NextRequest, NextResponse } from "next/server";
import knowledgeBase from "@/config/sir-knowledge-base.json";

const GROK_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROK_MODEL = "llama3-8b-8192";

type KBDocument = {
  id: string;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  category: string;
  tags: string[];
};

function findRelevantDocs(query: string, topK = 4): KBDocument[] {
  const q = query.toLowerCase();
  const docs = knowledgeBase.documents as KBDocument[];

  const scored = docs.map((doc) => {
    let score = 0;
    const haystack = (doc.title + " " + doc.content + " " + doc.tags.join(" ")).toLowerCase();
    const words = q.split(/\s+/).filter((w) => w.length > 2);
    words.forEach((word) => {
      if (haystack.includes(word)) score += word.length > 5 ? 3 : 1;
    });
    doc.tags.forEach((tag) => {
      if (q.includes(tag.toLowerCase())) score += 5;
    });
    return { doc, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.doc);
}

function buildContext(docs: KBDocument[]): string {
  if (docs.length === 0) return "No specific documents found in the knowledge base for this query.";
  return docs
    .map(
      (d) =>
        `[SOURCE: ${d.source} | URL: ${d.sourceUrl} | DOC_ID: ${d.id}]\nTitle: ${d.title}\n${d.content}`
    )
    .join("\n\n---\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const { message, locale = "en", history = [] } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          answer: "AI assistant is not configured. Please set up the GROK_API_KEY environment variable. In the meantime, please call Voter Helpline 1950 or visit voters.eci.gov.in for assistance.",
          citations: [],
          confidence: 0,
          fallback: true,
        },
        { status: 200 }
      );
    }

    const relevantDocs = findRelevantDocs(message);
    const context = buildContext(relevantDocs);

    const languageInstructions: Record<string, string> = {
      hi: "Respond in simple, clear Hindi (हिंदी) that a village resident can easily understand.",
      te: "Respond in simple Telugu (తెలుగు).",
      ta: "Respond in simple Tamil (தமிழ்).",
      kn: "Respond in simple Kannada (ಕನ್ನಡ).",
      ml: "Respond in simple Malayalam (മലയാളം).",
      mr: "Respond in simple Marathi (मराठी).",
      gu: "Respond in simple Gujarati (ગુજરાતી).",
      pa: "Respond in simple Punjabi (ਪੰਜਾਬੀ).",
      bn: "Respond in simple Bengali (বাংলা).",
      or: "Respond in simple Odia (ଓଡ଼ିଆ).",
      as: "Respond in simple Assamese (অসমীয়া).",
      ur: "Respond in simple Urdu (اردو).",
      en: "Respond in clear, simple English.",
    };

    const langInstr = languageInstructions[locale] || languageInstructions.en;

    const systemMessage = `${knowledgeBase.systemPrompt}

${langInstr}

OFFICIAL KNOWLEDGE BASE:
${context}

RESPONSE FORMAT:
1. Give a clear, simple answer.
2. Keep it brief (under 150 words).
3. Use bullet points for steps.
4. End with: "Source: [source name]"
5. If the answer is not in the knowledge base, say exactly: "This information could not be verified from official Election Commission resources. Please call Voter Helpline 1950 or visit www.eci.gov.in"`;

    const messages = [
      { role: "system", content: systemMessage },
      ...history.slice(-4).map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages,
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Grok API error:", err);
      throw new Error(`Grok API responded with status ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content ?? "Unable to generate response.";

    const citations = relevantDocs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      source: doc.source,
      url: doc.sourceUrl,
      category: doc.category,
    }));

    return NextResponse.json({
      answer,
      citations,
      confidence: relevantDocs.length > 0 ? Math.min(0.95, 0.6 + relevantDocs.length * 0.1) : 0.1,
      fallback: false,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      {
        answer: error instanceof Error ? error.message : "An unexpected error occurred",
        citations: [],
        confidence: 0,
        fallback: true,
        error: true,
      },
      { status: 200 }
    );
  }
}
