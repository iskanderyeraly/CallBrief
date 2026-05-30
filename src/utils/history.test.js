import { describe, it, expect, beforeEach } from 'vitest';
import { loadHistory, saveHistory } from './history';

beforeEach(() => { localStorage.clear(); });

describe('loadHistory', () => {
  it('returns empty array when nothing stored', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('returns parsed array when data exists', () => {
    const data = [{ company_name: 'Apple', verdict: 'beat' }];
    localStorage.setItem('earnings_history', JSON.stringify(data));
    expect(loadHistory()).toEqual(data);
  });

  it('returns empty array on corrupt JSON', () => {
    localStorage.setItem('earnings_history', 'not-json');
    expect(loadHistory()).toEqual([]);
  });
});

describe('saveHistory', () => {
  it('prepends entry, adds _savedAt, returns updated array', () => {
    const summary = { company_name: 'Apple', verdict: 'beat' };
    const result = saveHistory(summary);
    expect(result[0].company_name).toBe('Apple');
    expect(result[0]._savedAt).toBeDefined();
  });

  it('newest entry is first', () => {
    saveHistory({ company_name: 'First' });
    const result = saveHistory({ company_name: 'Second' });
    expect(result[0].company_name).toBe('Second');
  });

  it('caps at 5 entries', () => {
    for (let i = 0; i < 6; i++) saveHistory({ company_name: `Company${i}` });
    expect(loadHistory()).toHaveLength(5);
  });

  it('persists to localStorage', () => {
    saveHistory({ company_name: 'Apple' });
    expect(localStorage.getItem('earnings_history')).toContain('Apple');
  });
});
