const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Summarize the following meeting notes and extract action items:\n\n${text}`
        }
      ]
    });

    const summary = message.content[0].type === 'text' ? message.content[0].text : '';
    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
