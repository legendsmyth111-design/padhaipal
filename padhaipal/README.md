# 📘 PadhaiPal — Your Free AI Study Companion

> **⚠️ Fill in before submitting:** replace `[PASTE YOUR LIVE VERCEL URL HERE]` below with your
> real deployed link, and add your own screenshots (see section F). Instructions for both are in
> `DEPLOY.md`.

## a. What it does & the problem it solves

**PadhaiPal** ("study companion" in Urdu/Hindi) is a free, no-login web app built for college
students — especially at small-city and rural colleges like Government Postgraduate College,
Mansehra — who don't have easy access to affordable private tutoring or 24/7 academic help.

Instead of getting stuck on a concept at midnight with no one to ask, a student can open
PadhaiPal on any browser and:
- Ask an AI study buddy any academic question, in English or Roman Urdu, and get a clear,
  step-by-step explanation.
- Generate a custom practice quiz on any topic and grade themselves instantly.
- Log their study sessions and see their hours, streaks, and subject breakdown over time.

No sign-up, no account, no password — the app works the moment the link is opened, including in
an incognito window.

**Who it's for:** college students who need extra academic support but don't have consistent
access to a tutor, especially outside major cities.

## b. Live deployed URL

🔗 **[PASTE YOUR LIVE VERCEL URL HERE]**

## c. Features

| Page | Feature |
|---|---|
| Home | Landing page explaining the app and the problem it solves |
| AI Study Buddy | Free-form chat with an AI tutor — bilingual (Roman Urdu / English), step-by-step explanations, quick-start topic chips |
| AI Quiz Generator | Enter any topic + difficulty + question count → AI generates a custom MCQ quiz → take it → get instant score, correct answers, and explanations |
| Study Tracker | Log study sessions (subject, minutes, date) → see total hours, sessions logged, day streak, and subjects covered → remove sessions → all stored locally in the browser, no server, no login |
| About | Explains the problem, the exact AI system prompts used, the feature list, and the tools/tech stack |

Other things every page has: responsive mobile layout, no login anywhere in the app, an EN /
Roman-Urdu language toggle in the navbar (saved per browser), and a consistent notebook-inspired
design.

## d. The AI feature

PadhaiPal has **two** AI-powered features, both backed by the **Google Gemini API**, called
from serverless backend functions (`/api/chat.js` and `/api/quiz.js`) so the API key is never
exposed in the browser.

### 1. AI Study Buddy (chat)
Answers any academic question a student asks, matching their language and keeping explanations
simple and encouraging.

**System prompt used** (also shown on the About page):
```
You are PadhaiPal Study Buddy, an AI tutor for college students in Pakistan, many of whom study
at small-city or rural colleges with limited access to private tutoring.

Rules:
- Match the student's language: if they write in Roman Urdu/English mix, reply the same way; if
  they write in plain English, reply in plain English.
- Explain concepts simply, step by step, using everyday examples a Pakistani student would relate to.
- Keep answers focused and not too long — a student reading on a phone should be able to follow it
  in one go.
- If a question is a factual homework question, still explain the reasoning, don't just give the
  final answer.
- Be encouraging and patient. Never make the student feel bad for not knowing something.
- If asked something unrelated to study/education/career, gently steer back to how you can help
  academically.
- Do not do anything unsafe or generate content unrelated to a respectful, academic tutoring context.
```

### 2. AI Quiz Generator
Takes a topic, difficulty, and question count, and returns a structured MCQ quiz as JSON, which
the frontend renders and auto-grades.

**System prompt used:**
```
You are PadhaiPal's quiz generator. Given a topic, a difficulty level, and a number of questions,
generate a multiple-choice quiz to help a college student practice.

Rules:
- Output ONLY valid JSON, no markdown fences, no extra commentary, matching exactly this shape:
  { "questions": [ { "question": string, "options": [string, string, string, string],
    "correctIndex": number (0-3), "explanation": string } ] }
- Generate exactly the requested number of questions.
- Match the requested difficulty: Easy = definitions/basic recall, Medium = applied understanding,
  Hard = multi-step reasoning or analysis.
- Questions must be accurate, unambiguous, and have exactly one correct option.
- Write a short one-line explanation for why the correct answer is correct.
- Keep language clear and exam-relevant to a Pakistani college curriculum where applicable.
```

## e. Tools, services & models used

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (no framework, no build step)
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI model/provider:** Google Gemini API (`gemini-2.5-flash` by default — configurable
  via the `AI_MODEL` environment variable)
- **Storage:** Browser `localStorage` for the Study Tracker (no database needed)
- **Hosting/Deployment:** Vercel
- **Version control:** Git & GitHub
- **Fonts:** Google Fonts (Fraunces, Work Sans, IBM Plex Mono)
- **Built with help from:** Claude (Anthropic) as an AI coding assistant during development

## f. Screenshots

> Add at least 3 screenshots here after you deploy — e.g. Home page, AI Study Buddy in a
> conversation, and the Quiz Generator showing a graded quiz.

```
![Home page](screenshots/home.png)
![AI Study Buddy](screenshots/assistant.png)
![Quiz Generator](screenshots/quiz.png)
![Study Tracker](screenshots/tracker.png)
```

## g. How to run the project

### Run locally
1. Install the [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
2. Clone this repo and enter it:
   ```
   git clone https://github.com/<your-username>/padhaipal.git
   cd padhaipal
   ```
3. Copy `.env.example` to `.env` and add your own Gemini API key:
   ```
   cp .env.example .env
   ```
4. Run the dev server (this serves the static pages **and** the `/api` functions together):
   ```
   vercel dev
   ```
5. Open the printed local URL (e.g. `http://localhost:3000`) in your browser.

### Deploy your own copy
Full step-by-step deployment instructions (GitHub + Vercel + environment variables) are in
[`DEPLOY.md`](./DEPLOY.md).

---

## Project structure

```
padhaipal/
├── index.html          # Home page
├── assistant.html       # AI Study Buddy (chat)
├── quiz.html            # AI Quiz Generator
├── tracker.html         # Study Tracker (localStorage)
├── about.html            # About / how it works / system prompts
├── css/style.css         # Shared styles
├── js/
│   ├── assistant.js      # Chat frontend logic
│   ├── quiz.js            # Quiz frontend logic
│   └── tracker.js         # Tracker frontend logic (localStorage)
├── api/
│   ├── chat.js            # Serverless function → Gemini API (Study Buddy)
│   └── quiz.js             # Serverless function → Gemini API (Quiz Generator)
├── package.json
├── .env.example
└── .gitignore
```

## Notes on privacy & security

- The Gemini API key lives only in the hosting provider's environment variables — it is never
  committed to the repo and never sent to the browser.
- The Study Tracker stores data only in the user's own browser (`localStorage`); nothing is sent
  to any server.
- No accounts, no passwords, no personal data collection anywhere in the app.
