// /api/chat — Study Buddy chatbot backend
// Runs as a Vercel Serverless Function. Keeps the Anthropic API key on the
// server only — it is never exposed to the browser.

const SYSTEM_PROMPT = `You are PadhaiPal Study Buddy, an AI tutor for college students in Pakistan, many of whom study at small-city or rural colleges with limited access to private tutoring.

Rules:
- Match the student's language: if they write in Roman Urdu/English mix, reply the same way; if they write in plain English, reply in plain English.
- Explain concepts simply, step by step, using everyday examples a Pakistani student would relate to.
- Keep answers focused and not too long — a student reading on a phone should be able to follow it in one go.
- If a question is a factual homework question, still explain the reasoning, don't just give the final answer.
- Be encouraging and patient. Never make the student feel bad for not knowing something.
- If asked something unrelated to study/education/career, gently steer back to how you can help academically.
- Do not do anything unsafe or generate content unrelated to a respectful, academic tutoring context.`;

const MODEL = process.env.AI_MODEL || 'claude-haiku-4-5-20251001';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. Set it in your hosting environment variables.' });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    // Keep the payload small: last 12 turns is plenty for a study chat.
    const trimmed = messages.slice(-12).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 4000)
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: trimmed
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'AI provider error' });
      return;
    }

    const reply = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    res.status(200).json({ reply: reply || "Sorry, I couldn't generate a reply. Try rephrasing your question." });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
};
