const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Debug: Log every request
app.use((req, res, next) => {
  console.log(`[Vercel] ${req.method} ${req.originalUrl} - from ${req.headers['x-vercel-ip-country'] || 'unknown'}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend alive', env: process.env.NODE_ENV });
});

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

// 404 handler - make it log too
app.use((req, res) => {
  console.log(`[404] Not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
});

// Production serving
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, 'client', 'dist');
  console.log(`[Production] Serving static from: ${clientPath}`);

  app.use(express.static(clientPath));

  // Catch-all - MUST be after static and after all other routes
  app.get('*', (req, res) => {
    const indexPath = path.join(clientPath, 'index.html');
    console.log(`[SPA] Serving index.html for: ${req.originalUrl} → ${indexPath}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('[SPA Error]', err);
        res.status(500).send('Error serving frontend');
      }
    });
  });
}

// Start server for local development
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;