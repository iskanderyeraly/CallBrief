const KEY = 'earnings_history';
const MAX = 5;

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveHistory(summary) {
  const prev = loadHistory();
  const entry = { ...summary, _savedAt: new Date().toISOString() };
  const updated = [entry, ...prev].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
