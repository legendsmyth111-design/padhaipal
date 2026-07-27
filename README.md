
# 📘 PadhaiPal — Your Free AI Study Companion


## a. What it does & the problem it solves

**PadhaiPal** ("study companion" in Urdu/Hindi) is a free, no-login web app built for college students — especially at small-city and rural colleges like Government Postgraduate College, Mansehra — who don't have easy access to affordable private tutoring or 24/7 academic help.

Instead of getting stuck on a concept at midnight with no one to ask, a student can open PadhaiPal on any browser and:
- Ask an AI study buddy any academic question, in English or Roman Urdu, and get a clear, step-by-step explanation.
- Generate a custom practice quiz on any topic and grade themselves instantly.
- Log their study sessions and see their hours, streaks, and subject breakdown over time.

No sign-up, no account, no password — the app works the moment the link is opened, including in an incognito window.

**Who it's for:** college students who need extra academic support but don't have consistent access to a tutor, especially outside major cities.

## b. Live deployed URL

🔗 https://padhaipal-39dv.vercel.app/

## c. Features

| Page | Feature |
|---|---|
| Home | Landing page explaining the app and the problem it solves |
| AI Study Buddy | Free-form chat with an AI tutor — bilingual (Roman Urdu / English), step-by-step explanations, quick-start topic chips |
| AI Quiz Generator | Enter any topic + difficulty + question count → AI generates a custom MCQ quiz → take it → get instant score, correct answers, and explanations |
| Study Tracker | Log study sessions (subject, minutes, date) → see total hours, sessions logged, day streak, and subjects covered → remove sessions → all stored locally in the browser, no server, no login |
| About | Explains the problem, the exact AI system prompts used, the feature list, and the tools/tech stack |

Other features: responsive mobile layout, zero login required, EN / Roman-Urdu language toggle in the navbar, and a clean notebook-inspired UI.

## d. The AI feature

PadhaiPal features **two** AI-powered tools, both powered by **Groq Cloud API** (`llama-3.3-70b-versatile` model), called via serverless backend functions (`/api/chat.js` and `/api/quiz.js`) to ensure the API key is never exposed to the client browser.

### 1. AI Study Buddy (Chat)
Answers academic questions by matching the student's language (English or Roman Urdu) and breaking down complex concepts step-by-step.

**System prompt used:**
You are PadhaiPal Study Buddy, an AI tutor for college students in Pakistan, many of whom study at small-city or rural colleges with limited access to private tutoring.

Rules:

Match the student's language: if they write in Roman Urdu/English mix, reply the same way; if they write in plain English, reply in plain English.

Explain concepts simply, step by step, using everyday examples a Pakistani student would relate to.

Keep answers focused and not too long — a student reading on a phone should be able to follow it in one go.

If a question is a factual homework question, still explain the reasoning, don't just give the final answer.

Be encouraging and patient. Never make the student feel bad for not knowing something.

If asked something unrelated to study/education/career, gently steer back to how you can help academically.

Do not do anything unsafe or generate content unrelated to a respectful, academic tutoring context.


### 2. AI Quiz Generator
Generates structured JSON MCQ quizzes based on topic, difficulty level, and question count, which are rendered and auto-graded on the frontend.

**System prompt used:**
You are PadhaiPal's quiz generator. Given a topic, a difficulty level, and a number of questions, generate a multiple-choice quiz to help a college student practice.

Rules:

Output ONLY valid JSON, no markdown fences, no extra commentary, matching exactly this shape:
{ "questions": [ { "question": string, "options": [string, string, string, string],
"correctIndex": number (0-3), "explanation": string } ] }

Generate exactly the requested number of questions.

Match the requested difficulty: Easy = definitions/basic recall, Medium = applied understanding, Hard = multi-step reasoning or analysis.

Questions must be accurate, unambiguous, and have exactly one correct option.

Write a short one-line explanation for why the correct answer is correct.

Keep language clear and exam-relevant to a Pakistani college curriculum where applicable.


## e. Tools, services & models used

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (No frameworks, lightweight & fast)
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI Model & Provider:** Groq Cloud API using `llama-3.3-70b-versatile` (configurable via `AI_MODEL` environment variable)
- **Storage:** Browser `localStorage` for Study Tracker data persistence
- **Hosting/Deployment:** Vercel
- **Version Control:** Git & GitHub
- **Fonts:** Google Fonts (Fraunces, Work Sans, IBM Plex Mono)

## f. Screenshots

![Home Page](screenshots/home.png)
<img width="943" height="436" alt="home" src="https://github.com/user-attachments/assets/09d3c3d2-8873-4f11-8b04-3566daa7536c" />

![AI Study Buddy](screenshots/assistant.png)
<img width="942" height="438" alt="assistant" src="https://github.com/user-attachments/assets/d4c31f02-3316-413b-90c8-6cd57414b212" />

![Quiz Generator](screenshots/quiz.png)
<img width="945" height="446" alt="quiz" src="https://github.com/user-attachments/assets/2a07555b-6eb4-44aa-9c6b-9873ba660d8b" />

![Study Tracker](screenshots/tracker.png)
<img width="946" height="442" alt="tracker" src="https://github.com/user-attachments/assets/f9cfd3fc-78fc-4ab1-adbc-5a61b8bb1e1f" />


## g. How to run the project

### Run locally
1. Install the [Vercel CLI](https://vercel.com/docs/cli):
   ```bash
   npm i -g vercel
Clone this repo and enter the project folder:

Bash
git clone [https://github.com/](https://github.com/)<legendsmyth111-design>/padhaipal.git
cd padhaipal
Set your environment variables in .env:

Bash
GROQ_API_KEY=your_groq_api_key_here
AI_MODEL=llama-3.3-70b-versatile
Run the development server:

Bash
vercel dev
Open http://localhost:3000 in your browser.

Notes on privacy & security
The GROQ_API_KEY is strictly managed on the server side via Vercel Environment Variables — it is never exposed to the frontend browser or committed to GitHub.

Study Tracker data is stored exclusively in the browser's localStorage.

Zero account setup required; no user identification or personal data is collected.
