# AI Workplace Productivity Assistant

## Scope
Build one cohesive, responsive SaaS-style workspace for South African professionals with four navigable views: dashboard, meeting summariser, task planner, and AI assistant. Everything remains session-only in the browser; the only server-side code is the secure AI gateway required for dynamic responses.

## Experience
- Create a dark charcoal dashboard shell with pine-green actions, off-white work surfaces, restrained borders, compact rounding, and professional typography.
- Add persistent desktop navigation, a reduced tablet treatment, and an accessible mobile drawer.
- Build a dashboard with greeting, quick actions, recent in-session activity, and the responsible-AI notice.
- Keep navigation and in-session work connected so users can move between workflows without losing current inputs or generated results.

## Meeting Summariser
- Provide meeting title, date, and a large notes editor with clear validation and loading/error states.
- Send the notes to AI using a focused workplace prompt and return structured, useful content: executive summary, key points, decisions, action items, deadlines, and follow-ups.
- Render the result as editable fields and rows, with copy and delete/reset controls.

## Task Planner
- Provide daily/weekly mode, editable task entries, deadlines, and priorities.
- Generate an AI-prioritised daily timeline or Monday–Friday plan using urgency and importance.
- Include editable schedule entries, priority labels, deadlines, optimisation suggestions, copy, and delete/reset controls.

## AI Assistant
- Build one session-only conversation with no thread list or persistence.
- Use AI Elements for the transcript, markdown messages, loading state, and composer.
- Add suggested workplace prompts, multi-line Enter-to-send input, clear conversation, visible errors, and reliable input focus.
- Stream context-aware AI responses while sending the full current conversation each turn.

## Technical details
- Use TanStack Start routes/components and browser state only; no database, authentication, login, or local storage.
- Use the required `openai/gpt-6-astra` model through the secure Lovable AI Responses gateway; stream chat and use structured outputs for summaries and plans.
- Install and compose AI Elements primitives rather than recreating chat controls.
- Keep the AI key and prompts server-side. Surface credit, access, validation, and connection failures without fake fallback content.
- Add route-specific metadata, accessible controls, copy-to-clipboard feedback, responsive layouts, and reduced-motion support.
- Verify the three central workflows in the live app across desktop and mobile, including a real AI request.
