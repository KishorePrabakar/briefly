import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { text } from 'express';

function App() {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!notes) return;
    setLoading(true);
    try{
      const response = await axios.post('/api/summarize', { text: notes });
      setSummary(response.data.summary || 'Summary Recieved');
      console.log('Notes send' || {text : notes});
    }catch (error){
      console.error('Error sending to backend:', error);
      setSummary('Error: Could not get summary');
    }
    setLoading(false);
  };

  return (
    <>  
      <h1>Briefly - AI Meeting Assistant</h1>
      <textarea 
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder='Paste your meeting notes here...'
        rows={10}
        cols={50}/>
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Summarizing...' : 'Get Summary'}
      </button>
      {summary && (
        <div>
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </>
  );
}

export default App;
