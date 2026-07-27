// /api/chat — Study Buddy chatbot backend
// Runs as a Vercel Serverless Function. Keeps the Groq API key on the
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

const MODEL = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GROQ_API_KEY. Set it in your hosting environment variables.' });
    return;
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    // Convert chat history to OpenAI / Groq standard message format
    const formattedMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-12).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content || '').slice(0, 4000)
      }))
    ];

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: formattedMessages,
        max_tokens: 700
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data.error?.message || 'AI provider error' });
      return;
    }

    const reply = data.choices?.[0]?.message?.content?.trim();

    res.status(200).json({ reply: reply || "Sorry, I couldn't generate a reply. Try rephrasing your question." });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
};