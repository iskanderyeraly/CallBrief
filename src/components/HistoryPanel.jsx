const SENTIMENT_CLASS = { Bullish: 'hc-sentiment-bullish', Neutral: 'hc-sentiment-neutral', Bearish: 'hc-sentiment-bearish' };

export default function HistoryPanel({ open, onClose, history, onSelect }) {
  if (!open) return null;

  return (
    <div
      className="drawer-overlay"
      data-testid="drawer-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="drawer">
        <div className="drawer-header">
          <span className="drawer-title">Recent Summaries</span>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {history.length === 0 ? (
            <p className="drawer-empty">No recent summaries yet.</p>
          ) : (
            history.map((entry, i) => (
              <div
                key={i}
                className="history-card"
                data-testid="history-card"
                onClick={() => onSelect(entry)}
              >
                <div className="hc-top">
                  <span className="hc-ticker">{entry.company_name}</span>
                  <span className={`hc-sentiment ${SENTIMENT_CLASS[entry.sentiment] || ''}`}>
                    {entry.sentiment}
                  </span>
                </div>
                <div className="hc-verdict">{entry.verdict}</div>
                <div className="hc-date">{entry.quarter} · {entry.date}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
