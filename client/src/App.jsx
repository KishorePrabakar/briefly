// client/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // default dark like GitHub
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      setError('Please enter some meeting notes');
      return;
    }
    setLoading(true);
    setResult('');
    setError('');

    try {
      const res = await axios.post('/api/summarize', { text: notes });
      setResult(res.data.summary || 'No summary returned');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };


// Inside return:
return (
  <div className="app-container">
    <header className="header">
      <h1>Briefly</h1>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle dark/light mode"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>

    <div className="content-wrapper">
      <main className="main-content">
        <h2>AI Meeting Assistant</h2>
        <p className="subtitle">Paste your meeting notes or transcript below:</p>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Team discussed project timeline. Action: Update code by Friday..."
          rows={10}
          className="textarea"
        />

        <div className="button-wrapper">  {/* ← Centers button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`btn primary ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Summarizing...' : 'Get Summary'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <h3>Summary</h3>
            <div className="markdown-body">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
);
}

export default App;