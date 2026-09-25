import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatBody;
        if (!Array.isArray(messages))
          return new Response("Messages are required.", { status: 400 });
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("AI is not configured for this workspace.", { status: 500 });

        const initialRunId = getLovableAiGatewayRunId(request);
        const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system:
            "You are Workplace AI, a clear and dependable productivity assistant for South African professionals. Help with prioritisation, planning, meeting follow-ups, professional writing and practical workplace decisions. Be concise, specific and transparent about uncertainty. Never claim perfect accuracy. Do not request confidential, sensitive or personal information.",
          messages: await convertToModelMessages(messages as UIMessage[]),
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
          sendReasoning: true,
          headers: getLovableAiGatewayResponseHeaders(
            initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : undefined,
          ),
        });
        return withLovableAiGatewayRunIdHeader(response, runIdFetch);
      },
    },
  },
});
