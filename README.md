
 # AI Workplace Productivity Assistant

 A modern, responsive SaaS-style workplace productivity assistant designed for South African professionals.

 The application focuses on three core AI-powered workflows:

 - **Meeting Notes Summariser** — transform lengthy meeting notes into structured, actionable outputs.
- **AI Task Planner** — organise tasks, priorities and deadlines into practical daily and weekly schedules.
- **AI Assistant** — interact with a conversational workplace productivity assistant.

 This project is designed as a **frontend-first prototype** with a polished B2B SaaS experience. Developed through **Lovable AI**

---

 ## Overview

 AI Workplace Productivity Assistant helps professionals turn unstructured workplace information into useful actions and plans.

 The application provides:

 1. Meeting summarisation
2. Daily and weekly task planning
3. AI-powered workplace conversations
4. Editable AI-generated outputs
5. Copy-to-clipboard functionality
6. Responsive desktop, tablet and mobile experiences
7. Responsible AI guidance

---

 ## Core Workflows

 ### 1\. Meeting Notes Summariser

 Users can enter meeting information including:

 - Meeting title
- Meeting date
- Detailed meeting notes

 The AI generates an editable result containing:

 #### Executive Summary

 A concise professional overview of the meeting.

 #### Key Points

 Important discussion points presented as clear bullet points.

 #### Decisions Made

 Decisions reached during the meeting.

 #### Action Items

 Structured action items containing:

 | Field | Description |
| --- | --- |
| Action | Required task or follow-up |
| Responsible person | Person responsible for the task |
| Deadline | Expected completion date |
| Status | Current action status |

#### Follow-ups

 Suggested actions that should occur after the meeting.

 Generated content remains editable so users can correct or refine AI output.

 Available actions include:

 - Generate summary
- Edit output
- Copy output
- Clear/reset content

---

 ### 2\. AI Task Planner

 The Task Planner allows users to provide:

 - Tasks
- Deadlines
- Priority information
- Planning period

 The AI generates an actionable schedule.

 #### Daily Planning

 The daily planner presents tasks using a timeline, for example:

```
08:00 — 08:30   Review emails
08:30 — 10:00   Focused project work
10:00 — 10:15   Break
10:15 — 11:30   Client preparation
```

 The exact schedule is dynamically generated based on the user's input.

 #### Weekly Planning

 The weekly planner provides a Monday-to-Friday view.

 The layout remains usable on smaller screens through responsive stacking or horizontal scrolling.

 #### Priority Framework

 AI prioritisation uses an urgency/importance framework and categorise work as:

 - Critical
- High
- Medium
- Low

 Each planned task displays:

 - Task title
- Priority
- Deadline

 #### Time Optimisation

 The AI provides useful planning recommendations such as:

 - Grouping similar tasks
- Reducing context switching
- Protecting focused-work periods
- Leaving buffer time for unexpected work
- Prioritising deadline-sensitive work

 Generated plans are editable.

 Available actions include:

 - Edit
- Generate plan
- Copy plan
- Clear/reset content

---

 ### 3\. AI Assistant

 The AI Assistant provides a conversational workplace productivity experience.

 The interface includes:

 - User messages
- AI responses
- Conversation history within the current browser session
- Clear conversation action
- Text composer
- Send button
- Enter-to-send
- Multi-line input support

 Suggested prompts can include:

 - "Help me prioritise my tasks."
- "Create a focused schedule for today."
- "Draft a professional follow-up message."

 The assistant provides context-aware workplace responses rather than static placeholder messages.

 AI prompts are structured to encourage:

 - Professional responses
- Practical recommendations
- Clear formatting
- Concise workplace communication
- Useful task and planning guidance

---

 ## Application Structure

 ### Sidebar Navigation

 The primary navigation should contain:

 - Dashboard
- Meeting Summariser
- Task Planner
- AI Assistant

 The bottom of the navigation contains:

 - Responsible AI Usage

 The sidebar remains persistent on desktop and becomes a collapsible navigation drawer or mobile menu on smaller screens.

---

 ## Dashboard

 The dashboard acts as the central workspace and provide a cohesive entry point into the application.

 It includes:

 ### Greeting

 Example:

 > Good day

 ### Quick Actions

 Prominent actions provides direct access to:

 - Summarise meeting notes
- Plan my day
- Ask AI Assistant

 ### Dashboard Design

 The dashboard uses a professional SaaS layout with:

 - Responsive cards
- Strong visual hierarchy
- Clear primary actions
- Minimal visual clutter
- Consistent spacing
- Subtle status indicators

 The dashboard feels integrated with the rest of the application rather than functioning as an isolated mock screen.

---

 ## Responsible AI Usage

 Responsible AI guidance should be visible but unobtrusive throughout the application.

 Important information should remain reviewable and editable by the user.

---

 ## Design System

 The visual language is inspired by contemporary B2B SaaS products.

 ### Colour Palette

 | Purpose | Direction |
| --- | --- |
| Primary background | Very dark charcoal / near-black |
| Secondary surfaces | Dark grey |
| Light surfaces | Soft light grey / off-white |
| Primary accent | Pine green |
| Primary text | White |
| Secondary text | Muted grey |
| Positive states | Pine green |

 ### UI Characteristics

 The interface uses:

 - Modern typography
- Rounded cards
- Subtle borders
- Minimal shadows
- Strong spacing system
- Professional icons
- Clear hover states
- Clear active states
- Visible focus states
- Disabled states
- Subtle transitions
- Comfortable touch targets

---

 ## Responsive Design

 The application works across:

 ### Desktop

 - Persistent sidebar
- Spacious content areas
- Multi-column dashboard layouts
- Full-width workspaces where appropriate

 ### Tablet

 - Reduced sidebar width
- Flexible card layouts
- Responsive forms
- Adaptive content columns

 ### Mobile

 - Collapsible navigation drawer
- Single-column cards
- Mobile-friendly inputs
- Comfortable button sizes
- Chat interface optimised for small screens
- Horizontally scrollable or stacked weekly planner
- No unnecessary horizontal overflow

 All important controls should have comfortable touch targets.

---

 ## Architecture

 This project is intentionally designed as a frontend-focused application.

 ### Available:

 - Browser state
- Reusable components
- Responsive layouts
- AI-generated responses
- Clipboard functionality
- Editable generated content
- Client-side interaction state

 ### Not Available:

 - Backend servers
- Databases
- Authentication
- Login
- Registration
- User accounts
- Server-side persistence

 The application is usable immediately after opening it and any refresh or exit from tools will result in work being close so ensure work is saved on seperate application

---

 ## AI Integration

 AI functionality should be implemented through clearly structured prompts for each workflow.

 ## Function Summary

 ### Navigation

 - [ ] Dashboard navigation works
- [ ] Meeting Summariser navigation works
- [ ] Task Planner navigation works
- [ ] AI Assistant navigation works
- [ ] Responsible AI section is accessible
- [ ] Mobile navigation opens and closes correctly
- [ ] Active navigation state is visible

 ### Meeting Summariser

 - [ ] Meeting title input
- [ ] Meeting date input
- [ ] Notes textarea
- [ ] Summarise button
- [ ] AI-generated summary
- [ ] Editable executive summary
- [ ] Editable key points
- [ ] Editable decisions
- [ ] Editable action items
- [ ] Editable deadlines
- [ ] Editable follow-ups
- [ ] Copy functionality
- [ ] Clear/reset functionality

 ### Task Planner

 - [ ] Task input
- [ ] Deadline input
- [ ] Priority input
- [ ] Daily planning
- [ ] Weekly planning
- [ ] AI prioritisation
- [ ] Critical priority
- [ ] High priority
- [ ] Medium priority
- [ ] Low priority
- [ ] Generated timeline
- [ ] Generated weekly schedule
- [ ] Time optimisation suggestions
- [ ] Editable plan
- [ ] Copy plan functionality
- [ ] Clear/reset functionality

 ### AI Assistant

 - [ ] Message composer
- [ ] Send button
- [ ] Enter-to-send
- [ ] Multi-line input
- [ ] User message display
- [ ] AI response display
- [ ] Suggested prompts
- [ ] Clear conversation
- [ ] Responsive chat layout
- [ ] Dynamic AI responses
