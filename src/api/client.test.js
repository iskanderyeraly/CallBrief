// src/api/client.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { summarizeTranscript, fetchTranscript } from './client';

beforeEach(() => { vi.resetAllMocks(); });

describe('summarizeTranscript', () => {
  it('posts transcript to /summarize and returns json', async () => {
    const mockSummary = { company_name: 'Apple', verdict: 'Strong beat' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSummary),
    });
    const result = await summarizeTranscript('test transcript');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/summarize',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ transcript: 'test transcript' }) })
    );
    expect(result).toEqual(mockSummary);
  });

  it('throws when response is not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, text: () => Promise.resolve('Server error') });
    await expect(summarizeTranscript('x')).rejects.toThrow('Server error');
  });
});

describe('fetchTranscript', () => {
  it('posts ticker to /fetch-transcript and returns json', async () => {
    const mockResponse = { transcript: 'raw transcript text' };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockResponse) });
    const result = await fetchTranscript('AAPL');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/fetch-transcript',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ ticker: 'AAPL' }) })
    );
    expect(result).toEqual(mockResponse);
  });
});
