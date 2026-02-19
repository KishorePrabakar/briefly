const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());               
app.use(express.json());       

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive' });
});

require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/summarize', async (req, res) => {
  console.log('POST /api/summarize received → body:', req.body);
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid text' });
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting summarizer. Provide: 1. Concise summary (2-4 sentences). 2. Bullet list of action items. 3. Key decisions. Output in markdown.'
        },
        { role: 'user', content: `Summarize this meeting: ${text}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500
    });

    const output = completion.choices[0]?.message?.content || 'No output';
    res.json({ summary: output });
  } catch (err) {
    console.error('Groq error:', err);
    res.status(500).json({ error: 'AI summarization failed' });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: `Not found: ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});