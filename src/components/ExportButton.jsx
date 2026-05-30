import { useState } from 'react';
import { exportPdf } from '../api/client';

export default function ExportButton({ summary }) {
  const [exporting, setExporting] = useState(false);

  async function handleClick() {
    setExporting(true);
    try {
      await exportPdf(summary);
    } finally {
      setExporting(false);
    }
  }

  return (
    <button className="btn-export" onClick={handleClick} disabled={exporting}>
      {exporting ? 'Exporting...' : '↓ Export PDF'}
    </button>
  );
}
