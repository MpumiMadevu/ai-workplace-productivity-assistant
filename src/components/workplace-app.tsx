import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateTaskPlan, summariseMeeting } from "@/lib/productivity.functions";
import type {
  MeetingSummary,
  PlannerTaskInput,
  Priority,
  TaskPlan,
} from "@/lib/productivity.types";
import { useChat } from "@ai-sdk/react";
import { useServerFn } from "@tanstack/react-start";
import { DefaultChatTransport } from "ai";
import {
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  ClipboardCopy,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type View = "dashboard" | "meeting" | "planner" | "assistant" | "responsible";

const navigation = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "meeting" as const, label: "Meeting Summariser", icon: FileText },
  { id: "planner" as const, label: "Task Planner", icon: ClipboardCheck },
  { id: "assistant" as const, label: "AI Assistant", icon: MessageSquareText },
];

const quickActions = [
  {
    id: "meeting" as const,
    eyebrow: "MEETINGS",
    title: "Summarise meeting notes",
    text: "Turn raw discussion notes into decisions and action items.",
    icon: FileText,
  },
  {
    id: "planner" as const,
    eyebrow: "PLANNING",
    title: "Plan my day",
    text: "Build a focused schedule around deadlines and priorities.",
    icon: CalendarDays,
  },
  {
    id: "assistant" as const,
    eyebrow: "ASSISTANT",
    title: "Ask AI Assistant",
    text: "Get practical help with everyday workplace tasks.",
    icon: MessageSquareText,
  },
];

const suggestions = [
  "Help me prioritise my tasks.",
  "Create a focused schedule for today.",
  "Draft a professional follow-up message.",
];

const emptyMeeting: MeetingSummary = {
  executiveSummary: "",
  keyPoints: [],
  decisions: [],
  actionItems: [],
  deadlines: [],
  followUps: [],
};

function getErrorMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Something went wrong. Please try again.";
  if (message.includes("402"))
    return "AI credits are currently unavailable. Please check workspace billing and try again.";
  if (message.includes("403")) return "AI access is currently restricted for this workspace.";
  if (message.includes("429"))
    return "AI is receiving too many requests. Please wait a moment and try again.";
  return message;
}

function BrandMark() {
  return (
    <div
      className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"
      aria-hidden="true"
    >
      <span className="font-display text-base font-bold">W</span>
    </div>
  );
}

function Sidebar({
  view,
  setView,
  open,
  onClose,
}: {
  view: View;
  setView: (view: View) => void;
  open: boolean;
  onClose: () => void;
}) {
  const choose = (next: View) => {
    setView(next);
    onClose();
  };
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-overlay lg:hidden"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground transition-transform duration-200 lg:static lg:z-auto lg:w-[248px] lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-14 items-center justify-between px-2">
          <button className="flex items-center gap-3 text-left" onClick={() => choose("dashboard")}>
            <BrandMark />
            <span>
              <strong className="block font-display text-sm">Workplace AI</strong>
              <span className="block text-xs text-sidebar-muted">Productivity assistant</span>
            </span>
          </button>
          <Button
            className="lg:hidden"
            size="icon"
            variant="ghost"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>
        <nav className="mt-8 space-y-1" aria-label="Primary navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => choose(item.id)}
                className={`h-11 w-full justify-start px-3 ${view === item.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:text-sidebar-foreground"}`}
              >
                <Icon />
                {item.label}
              </Button>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-sidebar-border pt-4">
          <Button
            variant="ghost"
            onClick={() => choose("responsible")}
            className={`h-auto w-full justify-start px-3 py-3 text-left ${view === "responsible" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-muted hover:text-sidebar-foreground"}`}
          >
            <ShieldCheck />
            <span className="whitespace-normal">Responsible AI usage</span>
          </Button>
          <div className="mt-3 flex items-center gap-2 px-3 text-xs text-sidebar-muted">
            <span className="size-2 rounded-full bg-status-positive" />
            AI services available
          </div>
        </div>
      </aside>
    </>
  );
}

function PageHeader({
  title,
  description,
  onMenu,
}: {
  title: string;
  description: string;
  onMenu: () => void;
}) {
  return (
    <header className="flex min-h-20 items-center gap-3 border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      <Button
        className="lg:hidden"
        size="icon"
        variant="ghost"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>
      <div>
        <h1 className="font-display text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
        <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">{description}</p>
      </div>
    </header>
  );
}

function ResponsibleNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex gap-3 border border-border bg-muted/50 ${compact ? "rounded-md p-3" : "rounded-lg p-4"}`}
    >
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
      <div>
        <p className="text-sm font-medium text-foreground">Review before you rely</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          AI-generated content may contain errors or omissions. Review important information,
          deadlines and decisions before relying on it. Do not enter confidential, sensitive or
          personal information unless your organisation permits it.
        </p>
      </div>
    </div>
  );
}

function Dashboard({ setView, activity }: { setView: (view: View) => void; activity: string[] }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="border-b border-border pb-7">
        <p className="text-sm font-medium text-primary">GOOD DAY</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          What would you like to move forward today?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Summarise discussions, organise priorities, or get clear workplace guidance with AI.
        </p>
      </section>
      <section className="py-7">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">Quick actions</h3>
            <p className="mt-1 text-sm text-muted-foreground">Start with a focused workflow.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className="group min-h-52 rounded-lg border border-border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-10 place-items-center rounded-md bg-accent text-accent-foreground">
                    <Icon />
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
                <p className="mt-8 text-xs font-semibold text-primary">{item.eyebrow}</p>
                <h4 className="mt-2 font-display text-lg font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </button>
            );
          })}
        </div>
      </section>
      <section className="grid gap-5 border-t border-border pt-7 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h3 className="font-display text-lg font-semibold">This session</h3>
          <div className="mt-4 space-y-2">
            {activity.length ? (
              activity.slice(0, 4).map((item, i) => (
                <div
                  className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm"
                  key={`${item}-${i}`}
                >
                  <span className="grid size-7 place-items-center rounded-full bg-accent text-primary">
                    <Check className="size-4" />
                  </span>
                  {item}
                </div>
              ))
            ) : (
              <p className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">
                Your completed summaries and plans will appear here during this session.
              </p>
            )}
          </div>
        </div>
        <ResponsibleNotice />
      </section>
    </div>
  );
}

function EditableList({
  title,
  items,
  onChange,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 font-display text-base font-semibold">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary" />
            <Textarea
              aria-label={`${title} ${index + 1}`}
              value={item}
              onChange={(e) =>
                onChange(items.map((value, i) => (i === index ? e.target.value : value)))
              }
              className="min-h-11 resize-y bg-muted/35"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function MeetingWorkspace({ onActivity }: { onActivity: (value: string) => void }) {
  const runSummary = useServerFn(summariseMeeting);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    if (!title.trim() || !date || notes.trim().length < 20) {
      setError("Add a title, date, and at least 20 characters of meeting notes.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const output = await runSummary({ data: { title, date, notes } });
      setResult(output);
      onActivity(`Summarised “${title}”`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(
      `${title}\n\nExecutive Summary\n${result.executiveSummary}\n\nKey Points\n${result.keyPoints.map((x) => `• ${x}`).join("\n")}\n\nDecisions\n${result.decisions.map((x) => `• ${x}`).join("\n")}\n\nAction Items\n${result.actionItems.map((x) => `${x.action} — ${x.responsible} — ${x.deadline} — ${x.status}`).join("\n")}\n\nDeadlines\n${result.deadlines.join("\n")}\n\nFollow-ups\n${result.followUps.join("\n")}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.2fr)] lg:px-8 lg:py-7">
      <section className="self-start rounded-lg border border-border bg-card p-5 lg:sticky lg:top-5">
        <div className="mb-5">
          <p className="section-label">MEETING INPUT</p>
          <h2 className="mt-2 font-display text-xl font-semibold">Add your meeting notes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Raw notes are fine. The clearer the detail, the stronger the output.
          </p>
        </div>
        <div className="space-y-4">
          <label className="field-label">
            Meeting title
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Operations Review"
            />
          </label>
          <label className="field-label">
            Meeting date
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="field-label">
            Meeting notes
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste or type the discussion, decisions, owners and deadlines..."
              className="min-h-64 resize-y"
            />
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTitle("");
                setDate("");
                setNotes("");
                setError("");
              }}
              disabled={loading}
              aria-label="Clear meeting inputs"
              className="h-11"
            >
              <RotateCcw />
              Clear
            </Button>
            <Button onClick={submit} disabled={loading} className="h-11 flex-1">
              {loading ? "Analysing notes…" : "Summarise Notes"}
            </Button>
          </div>
        </div>
        <div className="mt-5">
          <ResponsibleNotice compact />
        </div>
      </section>
      <section className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="section-label">AI OUTPUT</p>
            <h2 className="mt-1 font-display text-xl font-semibold">Meeting brief</h2>
          </div>
          {result && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={copy}>
                {copied ? <Check /> : <ClipboardCopy />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setResult(null)}
                aria-label="Delete summary"
              >
                <Trash2 />
              </Button>
            </div>
          )}
        </div>
        {!result ? (
          <div className="grid min-h-[480px] place-items-center text-center">
            <div className="max-w-sm">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
                <FileText />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">
                Your structured summary will appear here
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You’ll be able to edit every section before copying it.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-7">
            <section>
              <h3 className="mb-3 font-display text-base font-semibold">Executive Summary</h3>
              <Textarea
                value={result.executiveSummary}
                onChange={(e) => setResult({ ...result, executiveSummary: e.target.value })}
                className="min-h-28 resize-y bg-muted/35"
              />
            </section>
            <EditableList
              title="Key Points"
              items={result.keyPoints}
              onChange={(keyPoints) => setResult({ ...result, keyPoints })}
            />
            <EditableList
              title="Decisions Made"
              items={result.decisions}
              onChange={(decisions) => setResult({ ...result, decisions })}
            />
            <section>
              <h3 className="mb-3 font-display text-base font-semibold">Action Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="p-2">Action</th>
                      <th className="p-2">Responsible person</th>
                      <th className="p-2">Deadline</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.actionItems.map((item, index) => (
                      <tr className="border-b border-border/70" key={index}>
                        {(["action", "responsible", "deadline", "status"] as const).map((key) => (
                          <td className="p-2" key={key}>
                            <Input
                              value={item[key]}
                              onChange={(e) =>
                                setResult({
                                  ...result,
                                  actionItems: result.actionItems.map((row, i) =>
                                    i === index ? { ...row, [key]: e.target.value } : row,
                                  ),
                                })
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <div className="grid gap-7 md:grid-cols-2">
              <EditableList
                title="Deadlines"
                items={result.deadlines}
                onChange={(deadlines) => setResult({ ...result, deadlines })}
              />
              <EditableList
                title="Follow-ups"
                items={result.followUps}
                onChange={(followUps) => setResult({ ...result, followUps })}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function PriorityBadge({ value }: { value: Priority }) {
  return <span className={`priority priority-${value.toLowerCase()}`}>{value}</span>;
}

function PlannerWorkspace({ onActivity }: { onActivity: (value: string) => void }) {
  const runPlanner = useServerFn(generateTaskPlan);
  const [mode, setMode] = useState<"daily" | "weekly">("daily");
  const [tasks, setTasks] = useState<PlannerTaskInput[]>([
    { id: "task-1", title: "", deadline: "", priority: "High" },
  ]);
  const [plan, setPlan] = useState<TaskPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const updateTask = (id: string, key: keyof Omit<PlannerTaskInput, "id">, value: string) =>
    setTasks((all) => all.map((task) => (task.id === id ? { ...task, [key]: value } : task)));
  const generate = async () => {
    const valid = tasks.filter((task) => task.title.trim());
    if (!valid.length) {
      setError("Add at least one task before generating a plan.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const output = await runPlanner({
        data: {
          mode,
          tasks: valid.map(({ title, deadline, priority }) => ({
            title,
            deadline: deadline || "Not specified",
            priority,
          })),
        },
      });
      setPlan(output);
      onActivity(`Created a ${mode} task plan`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  const copy = async () => {
    if (!plan) return;
    await navigator.clipboard.writeText(
      `${plan.overview}\n\n${plan.schedule.map((item) => `${item.day} ${item.time} — ${item.title} (${item.priority}) — ${item.deadline}`).join("\n")}\n\nSuggestions\n${plan.suggestions.map((x) => `• ${x}`).join("\n")}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
      <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex rounded-md bg-muted p-1">
            <Button
              className="flex-1"
              variant={mode === "daily" ? "default" : "ghost"}
              onClick={() => setMode("daily")}
            >
              Daily
            </Button>
            <Button
              className="flex-1"
              variant={mode === "weekly" ? "default" : "ghost"}
              onClick={() => setMode("weekly")}
            >
              Weekly
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="section-label">TASK INPUT</p>
              <h2 className="mt-1 font-display text-xl font-semibold">What needs attention?</h2>
            </div>
            <Button
              size="icon"
              variant="outline"
              aria-label="Add task"
              onClick={() =>
                setTasks([
                  ...tasks,
                  { id: crypto.randomUUID(), title: "", deadline: "", priority: "Medium" },
                ])
              }
            >
              <Plus />
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {tasks.map((task, index) => (
              <div className="rounded-md border border-border bg-muted/30 p-3" key={task.id}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    TASK {index + 1}
                  </span>
                  {tasks.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      aria-label={`Delete task ${index + 1}`}
                      onClick={() => setTasks(tasks.filter((x) => x.id !== task.id))}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </div>
                <Input
                  aria-label={`Task ${index + 1} title`}
                  value={task.title}
                  onChange={(e) => updateTask(task.id, "title", e.target.value)}
                  placeholder="Task title"
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Input
                    aria-label={`Task ${index + 1} deadline`}
                    type="date"
                    value={task.deadline}
                    onChange={(e) => updateTask(task.id, "deadline", e.target.value)}
                  />
                  <select
                    aria-label={`Task ${index + 1} priority`}
                    value={task.priority}
                    onChange={(e) => updateTask(task.id, "priority", e.target.value)}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    {["Critical", "High", "Medium", "Low"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <Button onClick={generate} disabled={loading} className="mt-5 h-11 w-full">
            {loading ? "Building your plan…" : "Generate Plan"}
          </Button>
        </section>
        <section className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="section-label">AI-GENERATED PLAN</p>
              <h2 className="mt-1 font-display text-xl font-semibold capitalize">
                {mode} schedule
              </h2>
            </div>
            {plan && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={copy}>
                  {copied ? <Check /> : <ClipboardCopy />}
                  {copied ? "Copied" : "Copy Plan"}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setPlan(null)}
                  aria-label="Delete plan"
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </div>
          {!plan ? (
            <div className="grid min-h-[460px] place-items-center text-center">
              <div className="max-w-sm">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-primary">
                  <CalendarDays />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  A realistic schedule, built around your work
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Add tasks and deadlines, then let AI balance urgency, focus and buffer time.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <Textarea
                value={plan.overview}
                onChange={(e) => setPlan({ ...plan, overview: e.target.value })}
                className="min-h-20 resize-y bg-muted/35"
              />
              <div
                className={`mt-5 ${mode === "weekly" ? "flex gap-3 overflow-x-auto pb-2 xl:grid xl:grid-cols-5" : "space-y-3"}`}
              >
                {mode === "weekly"
                  ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                      <div
                        className="min-w-[260px] rounded-md border border-border bg-muted/25 p-3 xl:min-w-0"
                        key={day}
                      >
                        <h3 className="font-display font-semibold">{day}</h3>
                        <div className="mt-3 space-y-3">
                          {plan.schedule
                            .filter((x) => x.day.toLowerCase() === day.toLowerCase())
                            .map((item, index) => (
                              <PlanItem
                                key={`${day}-${index}`}
                                item={item}
                                onChange={(next) =>
                                  setPlan({
                                    ...plan,
                                    schedule: plan.schedule.map((row) =>
                                      row === item ? next : row,
                                    ),
                                  })
                                }
                              />
                            ))}
                        </div>
                      </div>
                    ))
                  : plan.schedule.map((item, index) => (
                      <PlanItem
                        key={index}
                        item={item}
                        onChange={(next) =>
                          setPlan({
                            ...plan,
                            schedule: plan.schedule.map((row, i) => (i === index ? next : row)),
                          })
                        }
                      />
                    ))}
              </div>
              <section className="mt-7 border-t border-border pt-5">
                <h3 className="font-display text-base font-semibold">Time optimisation</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {plan.suggestions.map((tip, i) => (
                    <Textarea
                      key={i}
                      value={tip}
                      onChange={(e) =>
                        setPlan({
                          ...plan,
                          suggestions: plan.suggestions.map((x, n) =>
                            n === i ? e.target.value : x,
                          ),
                        })
                      }
                      className="min-h-28 resize-y bg-accent/45"
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PlanItem({
  item,
  onChange,
}: {
  item: TaskPlan["schedule"][number];
  onChange: (item: TaskPlan["schedule"][number]) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <Input
          aria-label="Scheduled time"
          value={item.time}
          onChange={(e) => onChange({ ...item, time: e.target.value })}
          className="h-8 max-w-32 border-0 bg-transparent px-0 font-mono text-xs font-semibold text-primary shadow-none"
        />
        <PriorityBadge value={item.priority} />
      </div>
      <Input
        aria-label="Task title"
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
        className="mt-1 border-0 bg-transparent px-0 font-medium shadow-none"
      />
      <p className="mt-1 text-xs text-muted-foreground">Due {item.deadline}</p>
      <Textarea
        aria-label="Planning rationale"
        value={item.rationale}
        onChange={(e) => onChange({ ...item, rationale: e.target.value })}
        className="mt-2 min-h-16 resize-y border-0 bg-muted/40 text-xs shadow-none"
      />
    </div>
  );
}

function AssistantWorkspace({ onActivity }: { onActivity: (value: string) => void }) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [errorText, setErrorText] = useState("");
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, setMessages, error } = useChat({
    transport,
    onError: (err) => setErrorText(getErrorMessage(err)),
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy, messages.length]);
  const send = async (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    setErrorText("");
    onActivity("Asked Workplace AI for guidance");
    await sendMessage({ text: value });
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Bot />
          </div>
          <div>
            <h2 className="font-display text-sm font-semibold">Workplace AI</h2>
            <p className="text-xs text-muted-foreground">Professional productivity support</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setMessages([]);
            setErrorText("");
            inputRef.current?.focus();
          }}
          disabled={!messages.length}
        >
          <RotateCcw />
          Clear conversation
        </Button>
      </div>
      <Conversation className="min-h-0">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-7 sm:px-6">
          {messages.length === 0 ? (
            <ConversationEmptyState>
              <div className="max-w-xl">
                <div className="mx-auto grid size-14 place-items-center rounded-lg border border-border bg-card text-primary">
                  <Bot />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold">
                  How can I help with your work?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ask for help planning priorities, preparing communication or working through a
                  workplace challenge.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => send(suggestion)}
                      className="rounded-md border border-border bg-card p-3 text-left text-sm transition hover:border-primary/60 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <MessageResponse key={index}>{part.text}</MessageResponse>
                    ) : null,
                  )}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking through your request…</Shimmer>
              </MessageContent>
            </Message>
          )}
          <ConversationScrollButton />
        </ConversationContent>
      </Conversation>
      <div className="border-t border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          {(errorText || error) && (
            <p
              role="alert"
              className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {errorText || getErrorMessage(error)}
            </p>
          )}
          <PromptInput onSubmit={({ text }) => send(text)} className="rounded-lg">
            <PromptInputTextarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your work…"
              className="min-h-24"
            />
            <PromptInputFooter>
              <p className="text-xs text-muted-foreground">
                Enter to send · Shift + Enter for a new line
              </p>
              <PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && !busy} />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            AI may make mistakes. Review important workplace information.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResponsiblePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="section-label">RESPONSIBLE AI</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">
        Use AI as a capable assistant, not a final authority.
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        AI can accelerate routine work, but your professional judgement remains essential.
      </p>
      <div className="mt-8">
        <ResponsibleNotice />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          [
            "Review important details",
            "Check names, figures, deadlines and decisions against the original source.",
          ],
          [
            "Protect workplace information",
            "Only enter information your organisation permits you to share with AI tools.",
          ],
          [
            "Keep human accountability",
            "The person using the output remains responsible for the final decision or communication.",
          ],
          [
            "Challenge uncertain output",
            "Ask for clarification and verify claims when an answer appears incomplete or unclear.",
          ],
        ].map(([title, text]) => (
          <section className="rounded-lg border border-border bg-card p-5" key={title}>
            <h3 className="font-display font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

const headers: Record<View, [string, string]> = {
  dashboard: ["Dashboard", "A clear view of your AI productivity tools."],
  meeting: ["Meeting Summariser", "Turn discussion notes into clear workplace outcomes."],
  planner: ["Task Planner", "Build a practical plan around urgency and importance."],
  assistant: ["AI Assistant", "Ask focused questions and get practical workplace guidance."],
  responsible: ["Responsible AI Usage", "Work confidently with clear safeguards."],
};

export function WorkplaceApp() {
  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activity, setActivity] = useState<string[]>([]);
  const addActivity = (value: string) =>
    setActivity((all) => [value, ...all.filter((x) => x !== value)]);
  const [title, description] = headers[view];
  return (
    <main className="flex h-dvh overflow-hidden bg-background">
      <Sidebar view={view} setView={setView} open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <PageHeader title={title} description={description} onMenu={() => setMenuOpen(true)} />
        <div
          className={`min-h-0 flex-1 ${view === "assistant" ? "flex flex-col overflow-hidden" : "overflow-y-auto"}`}
        >
          {view === "dashboard" && <Dashboard setView={setView} activity={activity} />}
          {view === "meeting" && <MeetingWorkspace onActivity={addActivity} />}
          {view === "planner" && <PlannerWorkspace onActivity={addActivity} />}
          {view === "assistant" && <AssistantWorkspace onActivity={addActivity} />}
          {view === "responsible" && <ResponsiblePage />}
        </div>
      </div>
    </main>
  );
}
