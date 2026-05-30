// src/api/client.js
const BASE = 'https://callbrief-production.up.railway.app';

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

export async function summarizeTranscript(transcript) {
  return (await post('/summarize', { transcript })).json();
}

export async function fetchTranscript(ticker) {
  return (await post('/fetch-transcript', { ticker })).json();
}


export async function exportPdf(summary) {
  const res = await post('/export-pdf', { summary });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(summary.company_name || 'summary').replace(/\s+/g, '_')}_earnings.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
