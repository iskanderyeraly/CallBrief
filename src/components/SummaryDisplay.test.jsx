// src/components/SummaryDisplay.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SummaryDisplay, { detectBadge } from './SummaryDisplay';

const mockSummary = {
  company_name: 'Apple Inc.', quarter: 'Q3 2024', date: '2024-08-01',
  financial_highlights: [
    'Revenue: $85.8B, beat estimate of $84.5B',
    'EPS: $1.26, missed estimate of $1.30',
    'Gross margin: 46.3%',
  ],
  key_positives: ['Services growth record'],
  key_risks: ['China weakness'],
  forward_guidance: 'Management guided Q4 revenue to $89–91B.',
  notable_analyst_questions: ['China recovery path?'],
  sentiment: 'Bullish',
  management_confidence_score: 8,
  guidance_direction: 'Raised',
  verdict: 'Strong beat driven by Services.',
};

describe('detectBadge', () => {
  it('returns beat for text containing "beat"', () => {
    expect(detectBadge('Revenue beat estimate')).toBe('beat');
  });
  it('returns beat case-insensitively', () => {
    expect(detectBadge('Revenue BEAT estimate')).toBe('beat');
  });
  it('returns miss for text containing "miss"', () => {
    expect(detectBadge('EPS missed estimate')).toBe('miss');
  });
  it('returns miss for text containing "below estimate"', () => {
    expect(detectBadge('Revenue below estimate')).toBe('miss');
  });
  it('returns null when no signal', () => {
    expect(detectBadge('Gross margin: 46.3%')).toBeNull();
  });
});

describe('SummaryDisplay', () => {
  it('renders company name, quarter, and date', () => {
    render(<SummaryDisplay summary={mockSummary} onNewAnalysis={vi.fn()} />);
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText(/Q3 2024/)).toBeInTheDocument();
    expect(screen.getByText(/2024-08-01/)).toBeInTheDocument();
  });

  it('renders verdict text', () => {
    render(<SummaryDisplay summary={mockSummary} onNewAnalysis={vi.fn()} />);
    expect(screen.getByText(/Strong beat driven by Services/)).toBeInTheDocument();
  });

  it('renders BEAT badge for highlight containing "beat"', () => {
    render(<SummaryDisplay summary={mockSummary} onNewAnalysis={vi.fn()} />);
    expect(screen.getByText('BEAT')).toBeInTheDocument();
  });

  it('renders MISS badge for highlight containing "miss"', () => {
    render(<SummaryDisplay summary={mockSummary} onNewAnalysis={vi.fn()} />);
    expect(screen.getByText('MISS')).toBeInTheDocument();
  });

  it('renders forward_guidance as paragraph text', () => {
    render(<SummaryDisplay summary={mockSummary} onNewAnalysis={vi.fn()} />);
    expect(screen.getByText(/Management guided Q4/)).toBeInTheDocument();
  });

  it('calls onNewAnalysis when New Analysis button clicked', () => {
    const onNewAnalysis = vi.fn();
    render(<SummaryDisplay summary={mockSummary} onNewAnalysis={onNewAnalysis} />);
    fireEvent.click(screen.getByRole('button', { name: /new analysis/i }));
    expect(onNewAnalysis).toHaveBeenCalledOnce();
  });
});
