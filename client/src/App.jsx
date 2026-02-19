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
  const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem('summaryHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);  

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
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        notes: notes,
        summary: res.data.summary || 'No summary'
      };
      const updatedHistory = [newEntry, ...history].slice(0, 10); // keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('summaryHistory', JSON.stringify(updatedHistory));
      const loadFromHistory = (entry) => {
      setNotes(entry.notes);
      setResult(entry.summary);
      setShowHistory(false);
    };
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
    <div className="history-section">
    <button 
      className="history-toggle"
      onClick={() => setShowHistory(!showHistory)}
    >
      {showHistory ? 'Hide History' : 'View Previous Summaries'} ({history.length})
    </button>

    {showHistory && (
      <div className="history-list">
        {history.length === 0 ? (
          <p>No summaries saved yet.</p>
        ) : (
          history.map(entry => (
            <div 
              key={entry.id} 
              className="history-item"
              onClick={() => loadFromHistory(entry)}
            >
              <small>{entry.timestamp}</small>
              <p>{entry.notes.substring(0, 60)}...</p>
            </div>
          ))
        )}
      </div>
    )}
  </div>
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
            <div className="result-header">
                <h3>Summary</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result)
                      .then(() => alert('Summary copied to clipboard!'))
                      .catch(() => alert('Failed to copy — please select and copy manually.'));
                  }}
                  className="btn secondary"
                >
                  Copy
                </button>
              </div>
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