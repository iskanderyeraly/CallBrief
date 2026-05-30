// src/components/SummaryDisplay.jsx
import SentimentMeter from './SentimentMeter';
import ExportButton from './ExportButton';

export function detectBadge(text) {
  const lower = text.toLowerCase();
  if (lower.includes('beat')) return 'beat';
  if (lower.includes('miss') || lower.includes('below estimate')) return 'miss';
  return null;
}

function sentimentValueClass(sentiment) {
  return sentiment === 'Bullish' ? 'score-value-green'
    : sentiment === 'Bearish'   ? 'score-value-red'
    : 'score-value-amber';
}

function guidanceValueClass(direction) {
  return direction === 'Raised'   ? 'score-value-blue'
    : direction === 'Lowered'     ? 'score-value-red'
    : 'score-value-muted';
}

function BulletList({ items, bulletClass }) {
  return items.map((item, i) => (
    <div key={i} className="card-item">
      <span className={`card-bullet ${bulletClass}`}>▸</span>
      <span className="card-item-text">{item}</span>
    </div>
  ));
}

function HighlightList({ items }) {
  return items.map((item, i) => {
    const badge = detectBadge(item);
    return (
      <div key={i} className="card-item">
        <span className="card-bullet bullet-blue">▸</span>
        <span className="card-item-text">
          {item}
          {badge === 'beat' && <span className="badge badge-beat">BEAT</span>}
          {badge === 'miss' && <span className="badge badge-miss">MISS</span>}
        </span>
      </div>
    );
  });
}

export default function SummaryDisplay({ summary, onNewAnalysis }) {
  const {
    company_name, quarter, date,
    financial_highlights, key_positives, key_risks,
    forward_guidance, notable_analyst_questions,
    sentiment, management_confidence_score, guidance_direction, verdict,
  } = summary;

  return (
    <div>
      {/* Company header */}
      <div className="company-header">
        <div className="company-name">{company_name}</div>
        <div className="company-meta">
          {quarter}
          <span className="company-meta-sep">·</span>
          {date}
        </div>
      </div>

      {/* Scorecard */}
      <div className="scorecard">
        <div className="score-cell">
          <div className="score-label">Sentiment</div>
          <div className={`score-value ${sentimentValueClass(sentiment)}`}>{sentiment}</div>
        </div>
        <div className="score-cell">
          <div className="score-label">Confidence</div>
          <div className="score-value score-value-green">
            {management_confidence_score}
            <span style={{ fontSize: 11, color: '#333' }}>/10</span>
          </div>
        </div>
        <div className="score-cell">
          <div className="score-label">Guidance</div>
          <div className={`score-value ${guidanceValueClass(guidance_direction)}`}>{guidance_direction}</div>
        </div>
      </div>

      <SentimentMeter sentiment={sentiment} />

      <div className="verdict-box">"{verdict}"</div>

      <div className="cards-grid">
        {/* Financial Highlights */}
        <div className="card card-blue">
          <div className="card-header">
            <div className="card-accent accent-blue" />
            <span className="card-title">Financial Highlights</span>
            <span className="card-count">{financial_highlights.length} items</span>
          </div>
          <div className="card-body">
            <HighlightList items={financial_highlights} />
          </div>
        </div>

        {/* Key Positives */}
        <div className="card card-green">
          <div className="card-header">
            <div className="card-accent accent-green" />
            <span className="card-title">Key Positives</span>
            <span className="card-count">{key_positives.length} items</span>
          </div>
          <div className="card-body">
            <BulletList items={key_positives} bulletClass="bullet-green" />
          </div>
        </div>

        {/* Key Risks */}
        <div className="card card-red">
          <div className="card-header">
            <div className="card-accent accent-red" />
            <span className="card-title">Key Risks</span>
            <span className="card-count">{key_risks.length} items</span>
          </div>
          <div className="card-body">
            <BulletList items={key_risks} bulletClass="bullet-red" />
          </div>
        </div>

        {/* Forward Guidance */}
        <div className="card card-amber">
          <div className="card-header">
            <div className="card-accent accent-amber" />
            <span className="card-title">Forward Guidance</span>
          </div>
          <div className="card-body">
            <p className="card-guidance-text">{forward_guidance}</p>
          </div>
        </div>

        {/* Analyst Questions */}
        <div className="card card-blue">
          <div className="card-header">
            <div className="card-accent accent-blue" />
            <span className="card-title">Notable Analyst Questions</span>
            <span className="card-count">{notable_analyst_questions.length} items</span>
          </div>
          <div className="card-body">
            <BulletList items={notable_analyst_questions} bulletClass="bullet-blue" />
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="bottom-actions">
        <button className="btn-new-analysis" onClick={onNewAnalysis}>↑ New Analysis</button>
        <ExportButton summary={summary} />
      </div>
    </div>
  );
}
