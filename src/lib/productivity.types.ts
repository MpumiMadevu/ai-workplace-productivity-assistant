export type Priority = "Critical" | "High" | "Medium" | "Low";

export type MeetingAction = {
  action: string;
  responsible: string;
  deadline: string;
  status: string;
};

export type MeetingSummary = {
  executiveSummary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: MeetingAction[];
  deadlines: string[];
  followUps: string[];
};

export type PlannedTask = {
  time: string;
  day: string;
  title: string;
  priority: Priority;
  deadline: string;
  rationale: string;
};

export type TaskPlan = {
  overview: string;
  schedule: PlannedTask[];
  suggestions: string[];
};

export type PlannerTaskInput = {
  id: string;
  title: string;
  deadline: string;
  priority: Priority;
};
