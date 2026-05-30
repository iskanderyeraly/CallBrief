const POSITIONS = { Bearish: 10, Neutral: 50, Bullish: 90 };

export default function SentimentMeter({ sentiment }) {
  const left = POSITIONS[sentiment] ?? 50;
  return (
    <div className="meter-wrap">
      <div className="meter-label">Sentiment Meter</div>
      <div className="meter-track">
        <div className="meter-marker" style={{ left: `${left}%` }} />
      </div>
      <div className="meter-ticks">
        <span>Bearish</span>
        <span>Neutral</span>
        <span>Bullish</span>
      </div>
    </div>
  );
}
