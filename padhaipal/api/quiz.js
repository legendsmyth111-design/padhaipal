// /api/quiz — AI Quiz Generator backend
// Runs as a Vercel Serverless Function. Keeps the Gemini API key on the
// server only — it is never exposed to the browser.

const SYSTEM_PROMPT = `You are PadhaiPal's quiz generator. Given a topic, a difficulty level, and a number of
questions, generate a multiple-choice quiz to help a college student practice.

Rules:
- Output ONLY valid JSON, no markdown fences, no extra commentary, matching exactly this shape:
  { "questions": [ { "question": string, "options": [string, string, string, string],
    "correctIndex": number (0-3), "explanation": string } ] }
- Generate exactly the requested number of questions.
- Match the requested difficulty: Easy = definitions/basic recall, Medium = applied understanding,
  Hard = multi-step reasoning or analysis.
- Questions must be accurate, unambiguous, and have exactly one correct option.
- Write a short one-line explanation for why the correct answer is correct.
- Keep language clear and exam-relevant to a Pakistani college curriculum where applicable.`;

const MODEL = process.env.AI_MODEL || 'gemini-2.5-flash';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Set it in your hosting environment variables.' });
    return;
  }

  try {
    const { topic, difficulty, count } = req.body || {};
    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'topic is required' });
      return;
    }
    const safeCount = Math.min(Math.max(Number(count) || 5, 1), 10);
    const safeDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';

    const userPrompt = `Topic: ${topic}\nDifficulty: ${safeDifficulty}\nNumber of questions: ${safeCount}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 2000, responseMimeType: 'application/json' }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'AI provider error' });
      return;
    }

    const raw = (data.candidates?.[0]?.content?.parts || [])
      .map(p => p.text || '')
      .join('\n')
      .trim();

    let parsed;
    try {
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      res.status(502).json({ error: 'AI returned an unexpected format. Please try again.' });
      return;
    }

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      res.status(502).json({ error: 'AI response missing questions array.' });
      return;
    }

    res.status(200).json({ questions: parsed.questions });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
};
