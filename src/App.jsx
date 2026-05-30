// src/App.jsx
import { useState } from 'react';
import TranscriptInput from './components/TranscriptInput';
import SummaryDisplay from './components/SummaryDisplay';
import HistoryPanel from './components/HistoryPanel';
import { summarizeTranscript, fetchTranscript } from './api/client';
import { loadHistory, saveHistory } from './utils/history';

export default function App() {
  const [ticker, setTicker]           = useState('');
  const [transcript, setTranscript]   = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [summary, setSummary]         = useState(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [history, setHistory]         = useState(() => loadHistory());

  async function runAnalysis(text) {
    setLoading(true);
    setError(null);
    try {
      const result = await summarizeTranscript(text);
      setSummary(result);
      const updated = saveHistory(result);
      setHistory(updated);
    } catch (e) {
      setError({ type: 'analyze', message: e.message || 'Analysis failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  async function handleFetch() {
    if (!ticker.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTranscript(ticker.trim());
      if (data.transcript) {
        setTranscript(data.transcript);
        await runAnalysis(data.transcript);
      } else {
        setError({ type: 'fetch', message: data.error || 'Could not fetch transcript. Please paste manually.' });
        setLoading(false);
      }
    } catch (e) {
      setError({ type: 'fetch', message: e.message || 'Fetch failed. Please paste manually.' });
      setLoading(false);
    }
  }

  function handleAnalyze() {
    if (!transcript.trim()) return;
    runAnalysis(transcript.trim());
  }

  function handleNewAnalysis() {
    setSummary(null);
    setTranscript('');
    setTicker('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSelectHistory(entry) {
    setSummary(entry);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <header className="topbar">
        <div className="logo">CallBrief</div>
        <button className="history-btn" onClick={() => setDrawerOpen(true)}>
          ⏱ History
        </button>
      </header>

      <main className="main">
        <div className="hero">
          <h1 className="hero-title">CALLBRIEF</h1>
          <p className="hero-sub">90-minute calls. 30-second insights.</p>
        </div>

        <TranscriptInput
          ticker={ticker}
          transcript={transcript}
          loading={loading}
          error={error}
          onTickerChange={setTicker}
          onTranscriptChange={setTranscript}
          onFetch={handleFetch}
          onAnalyze={handleAnalyze}
        />

        {summary && (
          <>
            <div className="results-divider" />
            <SummaryDisplay summary={summary} onNewAnalysis={handleNewAnalysis} />
          </>
        )}
      </main>

      <HistoryPanel
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
      />
    </>
  );
}
