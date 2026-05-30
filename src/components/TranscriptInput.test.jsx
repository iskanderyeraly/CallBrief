import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TranscriptInput from './TranscriptInput';

const base = {
  ticker: '', transcript: '', loading: false, error: null,
  onTickerChange: vi.fn(), onTranscriptChange: vi.fn(),
  onFetch: vi.fn(), onAnalyze: vi.fn(),
};

describe('TranscriptInput', () => {
  it('renders ticker input, textarea, and both buttons', () => {
    render(<TranscriptInput {...base} />);
    expect(screen.getByPlaceholderText('TICKER')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /fetch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
  });

  it('calls onFetch when Fetch button clicked', () => {
    const onFetch = vi.fn();
    render(<TranscriptInput {...base} onFetch={onFetch} />);
    fireEvent.click(screen.getByRole('button', { name: /fetch/i }));
    expect(onFetch).toHaveBeenCalledOnce();
  });

  it('calls onAnalyze when Analyze button clicked', () => {
    const onAnalyze = vi.fn();
    render(<TranscriptInput {...base} onAnalyze={onAnalyze} />);
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }));
    expect(onAnalyze).toHaveBeenCalledOnce();
  });

  it('hides Analyze button and shows loading state when loading=true', () => {
    render(<TranscriptInput {...base} loading={true} />);
    expect(screen.queryByRole('button', { name: /analyze/i })).not.toBeInTheDocument();
    expect(screen.getByText(/analyzing/i)).toBeInTheDocument();
  });

  it('shows fetch error below ticker input', () => {
    render(<TranscriptInput {...base} error={{ type: 'fetch', message: 'Ticker not found' }} />);
    expect(screen.getByText('Ticker not found')).toBeInTheDocument();
  });

  it('shows analyze error below textarea', () => {
    render(<TranscriptInput {...base} error={{ type: 'analyze', message: 'Analysis failed' }} />);
    expect(screen.getByText('Analysis failed')).toBeInTheDocument();
  });
});
