import { createOpenAI } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { Output, streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./ai-gateway.server";

const meetingInput = z.object({
  title: z.string().min(1),
  date: z.string().min(1),
  notes: z.string().min(20),
});

const priority = z.enum(["Critical", "High", "Medium", "Low"]);
const plannerInput = z.object({
  mode: z.enum(["daily", "weekly"]),
  tasks: z.array(z.object({ title: z.string(), deadline: z.string(), priority })),
});

const meetingOutput = z.object({
  executiveSummary: z.string(),
  keyPoints: z.array(z.string()),
  decisions: z.array(z.string()),
  actionItems: z.array(z.object({
    action: z.string(),
    responsible: z.string(),
    deadline: z.string(),
    status: z.string(),
  })),
  deadlines: z.array(z.string()),
  followUps: z.array(z.string()),
});

const planOutput = z.object({
  overview: z.string(),
  schedule: z.array(z.object({
    time: z.string(),
    day: z.string(),
    title: z.string(),
    priority,
    deadline: z.string(),
    rationale: z.string(),
  })),
  suggestions: z.array(z.string()),
});

function createModel() {
  const key = process.env['LOVABLE_API_KEY'];
  if (!key) throw new Error("AI is not configured for this workspace.");
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return lovable.responses("openai/gpt-6-astra");
}

const providerOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low" as const,
    reasoningSummary: "auto" as const,
    store: false,
    include: ["reasoning.encrypted_content"],
  },
};

export const summariseMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => meetingInput.parse(input))
  .handler(async ({ data }) => {
    const result = streamText({
      model: createModel(),
      output: Output.object({ schema: meetingOutput }),
      providerOptions,
      prompt: `You are a precise workplace productivity assistant for South African professionals. Analyse the meeting notes below. Do not invent facts, names, decisions, owners, or dates. Use "Not specified" where the notes do not provide them. Keep every section concise, professional, and actionable. Return up to 6 key points, 6 decisions, 8 action items, 6 deadlines and 6 follow-ups. Meeting title: ${data.title}. Meeting date: ${data.date}. Notes:\n${data.notes}`,
    });
    return await result.output;
  });

export const generateTaskPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => plannerInput.parse(input))
  .handler(async ({ data }) => {
    const result = streamText({
      model: createModel(),
      output: Output.object({ schema: planOutput }),
      providerOptions,
      prompt: `You are a pragmatic workplace planning assistant for South African professionals. Create a ${data.mode} plan from the supplied tasks. Apply urgency and importance, protect realistic focus blocks, include short buffers, and never change a supplied deadline. For daily plans use specific time ranges in the time field and set day to Today. For weekly plans distribute work Monday to Friday and include useful time ranges. Return no more than 12 schedule entries and exactly 3 concise optimisation suggestions. Tasks: ${JSON.stringify(data.tasks)}`,
    });
    return await result.output;
  });