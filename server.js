const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());               
app.use(express.json());       

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive' });
});

app.post('/api/summarize', (req, res) => {
  console.log('POST /api/summarize received → body:', req.body);
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Missing or invalid "text" field' });
  }
  // ... rest (dummy or AI)
  res.json({ summary: `Processed: ${text}` }); // or AI call
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