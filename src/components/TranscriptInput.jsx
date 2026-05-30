export default function TranscriptInput({
  ticker, transcript, loading, error,
  onTickerChange, onTranscriptChange, onFetch, onAnalyze,
}) {
  return (
    <div className="input-section">
      <div className="ticker-row">
        <input
          className="ticker-input"
          placeholder="TICKER"
          maxLength={10}
          value={ticker}
          onChange={e => onTickerChange(e.target.value)}
          disabled={loading}
        />
        <button className="btn-fetch" onClick={onFetch} disabled={loading}>
          Fetch →
        </button>
      </div>

      {error?.type === 'fetch' && (
        <p className="error-msg">{error.message}</p>
      )}

      <div className="or-divider">or paste transcript</div>

      <textarea
        className="transcript-area"
        placeholder="Paste earnings call transcript here..."
        value={transcript}
        onChange={e => onTranscriptChange(e.target.value)}
        disabled={loading}
      />

      {error?.type === 'analyze' && (
        <p className="error-msg">{error.message}</p>
      )}

      {loading ? (
        <div className="loading-row">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
          <span className="loading-label">Analyzing transcript...</span>
        </div>
      ) : (
        <button className="btn-analyze" onClick={onAnalyze}>
          ▶ Analyze Transcript
        </button>
      )}
    </div>
  );
}
