import { AnalysisReport } from '../types';

export function exportReportToPrintPDF(report: AnalysisReport) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to download/print report.');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>TruthLens AI Verification Report - ${report.id}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      padding: 40px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #1d4ed8;
      letter-spacing: -0.5px;
    }
    .badge {
      padding: 6px 14px;
      border-radius: 9999px;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    .badge-fake { background: #fee2e2; color: #991b1b; }
    .badge-misleading { background: #fef3c7; color: #92400e; }
    .badge-genuine { background: #dcfce7; color: #166534; }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 16px;
      border-radius: 12px;
      text-align: center;
    }
    .stat-val { font-size: 26px; font-weight: 800; }
    .stat-lbl { font-size: 12px; color: #6b7280; text-transform: uppercase; }

    .section {
      margin-bottom: 28px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
      margin-bottom: 12px;
      color: #1f2937;
    }
    ul { padding-left: 20px; margin: 0; }
    li { margin-bottom: 6px; }
    
    .source-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">TruthLens AI</div>
      <div style="font-size: 12px; color: #6b7280;">Digital Forensics & Verification Forensic Report</div>
    </div>
    <div class="badge badge-${report.verdict}">
      ${report.verdict.toUpperCase()} (${report.trustScore}% Trust Score)
    </div>
  </div>

  <h2 style="margin-top: 0; margin-bottom: 8px; font-size: 20px;">${report.title}</h2>
  <div style="font-size: 13px; color: #6b7280; margin-bottom: 24px;">
    <strong>Platform:</strong> ${report.platform} &nbsp;|&nbsp; 
    <strong>Scanned Date:</strong> ${new Date(report.timestamp).toLocaleString()} &nbsp;|&nbsp; 
    <strong>Report ID:</strong> ${report.id}
  </div>

  <div class="grid">
    <div class="stat-card">
      <div class="stat-val" style="color: ${report.trustScore < 40 ? '#dc2626' : report.trustScore < 70 ? '#d97706' : '#16a34a'}">
        ${report.trustScore}%
      </div>
      <div class="stat-lbl">Trust Score</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">${report.confidenceScore}%</div>
      <div class="stat-lbl">AI Confidence</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">${report.manipulationScore}%</div>
      <div class="stat-lbl">Manipulation Level</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">${report.viralityScore}%</div>
      <div class="stat-lbl">Virality Index</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">AI Forensic Summary</div>
    <p style="background: #f3f4f6; padding: 14px; border-radius: 8px; font-size: 14px;">${report.aiSummary}</p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px;">
    <div>
      <div class="section-title" style="color: #166534;">✔ What is Verified True</div>
      <ul>
        ${report.whatIsTrue.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
    <div>
      <div class="section-title" style="color: #991b1b;">❌ What is False / Fabricated</div>
      <ul>
        ${report.whatIsFalse.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  </div>

  ${report.missingContext.length > 0 ? `
  <div class="section">
    <div class="section-title" style="color: #92400e;">⚠️ Missing Context</div>
    <ul>
      ${report.missingContext.map(item => `<li>${item}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Fact-Checking Evidence & Sources</div>
    ${report.evidenceSources.map(src => `
      <div class="source-item">
        <strong>${src.title}</strong> — <em>${src.source}</em> (${src.rating})
        <br/><span style="font-size: 12px; color: #6b7280;">Credibility Score: ${src.credibilityScore}% | Date: ${src.publishDate}</span>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    TruthLens AI Cybersecurity & Forensic Intelligence Unit — Automated Verification Certificate
    <br/>Generated dynamically via Gemini 3.6 Flash Multi-modal Analysis Engine
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
