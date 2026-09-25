# AI Workplace Productivity Assistant

Build a modern, responsive SaaS-style web application called AI Workplace Productivity Assistant.

The application is a frontend-only prototype. Do NOT create or require a backend, database, authentication system, login/registration. All functionality should work entirely in the browser.

Core objective
Create a professional workplace productivity assistant for South African professionals that helps users:

Summarise meeting notes.

Plan daily and weekly tasks.

Interact with an AI chatbot.

The application should feel like a polished, credible SaaS product rather than a basic demo.

Design direction
Use a clean, modern, professional visual language inspired by contemporary B2B SaaS dashboards.

Colour palette
Primary background: very dark charcoal / near-black.

Secondary surfaces: dark grey.

Light surfaces: soft light grey / off-white.

Primary accent: pine green.

Use white and muted grey for typography.

Use pine green for primary actions, active states, highlights and positive status indicators.

Avoid excessive gradients, bright colours or overly decorative elements.

UI style
Clean spacing and strong visual hierarchy.

Rounded cards with subtle borders.

Minimal shadows.

Modern typography.

Professional icons.

Clear hover, active, focus and disabled states.

Smooth but subtle transitions.

Excellent readability.

Avoid a generic template appearance.

The application must work on desktop, tablet and mobile.

Application structure
Create a dashboard layout with:

Sidebar navigation
Include:

Dashboard

Meeting Summariser

Task Planner

AI Assistant

At the bottom of the sidebar include:

Responsible AI usage

On mobile, convert the sidebar into a responsive navigation drawer or mobile menu.

Dashboard
Create a polished dashboard home screen containing:

Header
Greeting such as:

"Good day"

Quick actions
Create prominent buttons/cards:

Summarise meeting notes

Plan my day

Ask AI Assistant


Meeting Notes Summariser
Create a dedicated workspace for converting lengthy meeting notes into useful workplace outputs.

Input section
Include:

Large editable text area

Meeting title

Meeting date

"Summarise Notes" button

AI output
After clicking the summarise button, display an editable AI generated result containing:

Executive Summary
A concise professional summary.

Key Points
Bullet points containing the important discussion points.

Decisions Made
Clearly identify decisions reached during the meeting.

Action Items
Use a structured table/card layout containing:

Action

Responsible person

Deadline

Status

Deadlines
Clearly highlight dates and deadlines.

Follow-ups
List suggested follow-up actions.

The AI output must be editable directly within the interface.

Include actions:

Copy

AI Task Planner
Create a dedicated task planning workspace.

Input
Allow the user to enter:

Tasks

Deadlines

Priority

Include a "Generate Plan" button.

AI-generated plan
Display a structured schedule.

For daily planning, show a timeline such as:

08:00 — 08:30
Task

08:30 — 10:00
Focused work

etc.

For weekly planning, show Monday to Friday in a clean responsive layout.

Each task should include:

Task title

Priority

Deadline

AI prioritisation
Use an urgency/importance framework.

Display categories such as:

Critical

High

Medium

Low

Time optimisation suggestions
Include AI-generated suggestions such as:

Grouping similar tasks

Reducing context switching

Leaving buffer time for unexpected work

Allow the generated plan to be edited.

Include:

Edit

Copy Plan

AI Assistant / Chatbot
Create a modern conversational AI interface.

Chat layout
Include:

User messages

AI responses

Clear conversation button

Provide a professional chat composer at the bottom with:

Text input

Send button

Enter-to-send

Multi-line input support

Suggested prompts
Display clickable suggestions such as:

"Help me prioritise my tasks."

"Create a focused schedule for today."

"Draft a professional follow-up message."

AI responses
The chatbot should provide realistic, context-aware workplace responses.

Responses must be generated dynamically by AI, not hardcoded or generic

User can ask work-placed related questions.

Use AI generated responses throughout. Structure prompts clearly for each feature so the AI produces, useful professional results

Responsible AI Usage
Include a clearly visible but unobtrusive responsible AI disclaimer.

Suggested wording:

"AI-generated content may contain errors or omissions. Review important information, deadlines and decisions before relying on it. Do not enter confidential, sensitive or personal information unless your organisation permits it."

Do not make claims that the AI is always accurate.

Responsive behaviour
The application must be fully responsive.

Desktop:

Persistent sidebar

Multi-column dashboard

Spacious content areas

Tablet:

Reduced sidebar width

Responsive cards

Flexible layouts

Mobile:

Collapsible navigation

Single-column cards

Mobile-friendly forms

Chat interface optimised for small screens

Horizontally scrollable or stacked weekly planner where appropriate

Ensure buttons and input fields have comfortable touch targets.

Data and architecture constraints
This is intentionally a frontend-only application.

Do NOT add:

Backend

Database

Authentication

Data storage

Use:

Browser state

Copy to clipboard functionality 

AI generated responses

Reusable frontend components

The application must be usable immediately after opening it.

Important quality requirement
Do not create a collection of disconnected mock screens.

Build a cohesive application where navigation, generated outputs, editing, saving, deleting and local persistence work together.

Use AI generated responses throughout the application. Do not use static placeholder responses as the final functionality. Structure prompts clearly for each feature so the AI produces, useful professional results

Prioritise:

Professional SaaS visual design

AI generated responses

Responsive UX

Functional interactions

Editable AI outputs

Responsible AI messaging

Do not add unnecessary features that increase complexity. Keep the implementation focused on the three core AI productivity workflows: Meeting Notes Summariser, AI Task Planner and AI Assistant.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9f3b4b4e-47bf-4ae1-ac0f-c4569eb375c1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
