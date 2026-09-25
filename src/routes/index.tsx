import { createFileRoute } from "@tanstack/react-router";
import { WorkplaceApp } from "@/components/workplace-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      { name: "description", content: "Summarise meetings, plan focused work and get practical AI assistance in one professional workspace." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "A professional AI workspace for meetings, task planning and everyday work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <WorkplaceApp />;
}
