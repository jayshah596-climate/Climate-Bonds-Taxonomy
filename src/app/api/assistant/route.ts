import { NextResponse } from "next/server";
import { answerLocally, answerWithClaude } from "@/lib/assistant";

export async function POST(request: Request) {
  let question = "";
  try {
    const body = await request.json();
    question = typeof body?.question === "string" ? body.question : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!question.trim()) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const result = await answerWithClaude(question);
      return NextResponse.json(result);
    }
  } catch (err) {
    console.error("LLM assistant failed, falling back to retrieval:", err);
  }

  const result = answerLocally(question);
  return NextResponse.json(result);
}
