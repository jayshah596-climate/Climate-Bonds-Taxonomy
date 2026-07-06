import { searchQuestion } from "@/lib/search";
import { getCategory } from "@/lib/data";

export interface Citation {
  title: string;
  href: string;
}

export interface AssistantAnswer {
  answer: string;
  citations: Citation[];
  mode: "retrieval" | "llm";
}

function retrieveContext(question: string) {
  const results = searchQuestion(question, { limit: 6 });
  const faqResults = results.filter((r) => r.type === "faq");
  return { results, faqs: faqResults };
}

/** Local, no-API-key retrieval assistant: matches the question against the indexed
 *  knowledge base and returns the closest sector/FAQ content with citations. */
export function answerLocally(question: string): AssistantAnswer {
  const q = question.toLowerCase();
  const { results } = retrieveContext(question);

  if (/resilien/.test(q) && /mitigat/.test(q) && /(differ|vs|versus|compare)/.test(q)) {
    const rc = getCategory("resilience");
    const mc = getCategory("mitigation");
    return {
      answer:
        "Mitigation certifies assets that directly cut greenhouse-gas emissions (solar farms, low-carbon buildings, electrified rail). Resilience — launched with Climate Bonds Standard v4.3 — certifies investments that make a measurable, substantial contribution to withstanding and adapting to climate hazards, while screening out maladaptation. A single project can sometimes qualify under both.",
      citations: [
        { title: mc?.name ?? "Mitigation", href: `/taxonomy/mitigation` },
        { title: rc?.name ?? "Resilience", href: `/taxonomy/resilience` },
        { title: "Certification Pathway", href: "/certification" },
      ],
      mode: "retrieval",
    };
  }

  if (/certif/.test(q) && /(how|step|process|document)/.test(q)) {
    return {
      answer:
        "To get Climate Bonds Certified: (1) select eligible assets against the relevant Sector Criteria, (2) engage an Approved Verifier for a pre-issuance review, (3) disclose use-of-proceeds and management-of-proceeds processes, (4) obtain Certification before or at issuance, and (5) publish annual post-issuance reporting with an updated Verifier's Report. See the full interactive pathway for documents required at each stage.",
      citations: [
        { title: "Certification Pathway", href: "/certification" },
        { title: "Issuer Hub", href: "/issuers" },
      ],
      mode: "retrieval",
    };
  }

  if (results.length > 0) {
    const top = results[0];
    const rest = results.slice(1, 4);
    return {
      answer: `${top.title}: ${top.description}`,
      citations: [
        { title: top.title, href: top.href },
        ...rest.map((r) => ({ title: r.title, href: r.href })),
      ],
      mode: "retrieval",
    };
  }

  return {
    answer:
      "I couldn't find a close match in the indexed Climate Bonds Taxonomy content. Try browsing the Taxonomy Explorer, or rephrase your question (e.g. \"Is solar eligible?\", \"Show transport criteria\", \"How do I certify a bond?\").",
    citations: [{ title: "Taxonomy Explorer", href: "/taxonomy" }],
    mode: "retrieval",
  };
}

/** If ANTHROPIC_API_KEY is configured, ground a real Claude call with the same
 *  retrieved context so answers stay grounded in the indexed knowledge base. */
export async function answerWithClaude(question: string): Promise<AssistantAnswer> {
  const { results } = retrieveContext(question);
  const context = results.map((r) => `${r.title}: ${r.description} (${r.href})`).slice(0, 8).join("\n\n");

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    system:
      "You are the Climate Bonds Taxonomy Explorer assistant. Answer ONLY using the provided context from the indexed Climate Bonds knowledge base. Be concise (under 120 words). If the context doesn't cover the question, say so and suggest browsing the Taxonomy Explorer. Never invent sector criteria or figures not present in the context.",
    messages: [
      {
        role: "user",
        content: `Context:\n${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => ("text" in b ? b.text : ""))
    .join("\n");

  const citations: Citation[] = [
    ...results.slice(0, 3).map((r) => ({ title: r.title, href: r.href })),
  ];

  return { answer: text || "No answer generated.", citations, mode: "llm" };
}
