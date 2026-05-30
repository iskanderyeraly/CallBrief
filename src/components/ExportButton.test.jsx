import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as client from '../api/client';
import ExportButton from './ExportButton';

const mockSummary = { company_name: 'Apple', verdict: 'beat' };

describe('ExportButton', () => {
  it('renders Export PDF button', () => {
    render(<ExportButton summary={mockSummary} />);
    expect(screen.getByRole('button', { name: /export pdf/i })).toBeInTheDocument();
  });

  it('calls exportPdf with summary on click', async () => {
    vi.spyOn(client, 'exportPdf').mockResolvedValue(undefined);
    render(<ExportButton summary={mockSummary} />);
    fireEvent.click(screen.getByRole('button', { name: /export pdf/i }));
    expect(client.exportPdf).toHaveBeenCalledWith(mockSummary);
  });

  it('disables button while export is in flight', async () => {
    let resolve;
    vi.spyOn(client, 'exportPdf').mockReturnValue(new Promise(r => { resolve = r; }));
    render(<ExportButton summary={mockSummary} />);
    fireEvent.click(screen.getByRole('button', { name: /export pdf/i }));
    expect(screen.getByRole('button')).toBeDisabled();
    resolve();
  });
});
