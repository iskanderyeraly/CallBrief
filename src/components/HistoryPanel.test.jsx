import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryPanel from './HistoryPanel';

const mockHistory = [
  {
    company_name: 'Apple Inc.', quarter: 'Q3 2024', date: '2024-08-01',
    sentiment: 'Bullish', verdict: 'Strong beat driven by Services.',
    _savedAt: '2024-08-01T10:00:00Z',
  },
];

describe('HistoryPanel', () => {
  it('renders nothing when open=false', () => {
    const { container } = render(
      <HistoryPanel open={false} onClose={vi.fn()} history={mockHistory} onSelect={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders history card when open=true', () => {
    render(<HistoryPanel open={true} onClose={vi.fn()} history={mockHistory} onSelect={vi.fn()} />);
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
  });

  it('calls onClose when X button clicked', () => {
    const onClose = vi.fn();
    render(<HistoryPanel open={true} onClose={onClose} history={mockHistory} onSelect={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '✕' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when overlay background clicked', () => {
    const onClose = vi.fn();
    render(<HistoryPanel open={true} onClose={onClose} history={mockHistory} onSelect={vi.fn()} />);
    fireEvent.click(screen.getByTestId('drawer-overlay'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onSelect with the clicked summary', () => {
    const onSelect = vi.fn();
    render(<HistoryPanel open={true} onClose={vi.fn()} history={mockHistory} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Apple Inc.').closest('[data-testid="history-card"]'));
    expect(onSelect).toHaveBeenCalledWith(mockHistory[0]);
  });

  it('shows empty message when history is empty', () => {
    render(<HistoryPanel open={true} onClose={vi.fn()} history={[]} onSelect={vi.fn()} />);
    expect(screen.getByText(/no recent summaries/i)).toBeInTheDocument();
  });
});
