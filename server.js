const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());               
app.use(express.json());       

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive' });
});

app.post('/api/summarize', (req, res) => {
  console.log('POST /api/summarize received → body:', req.body); // ← debug log

  const { meetingText } = req.body;

  if (!meetingText) {
    return res.status(400).json({ error: 'meetingText is required' });
  }

  const result = {
    summary: 'Dummy summary of the meeting.',
    action_items: ['Action 1', 'Action 2'],
    key_decisions: ['Decision A', 'Decision B']
  };

  res.json(result);
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