// Report generation utilities for analytics dashboard

export interface ReportData {
  title: string
  generatedDate: string
  kpis: Array<{
    title: string
    value: string
    trend: string
  }>
  regions: Array<{
    name: string
    issues: number
    resolved: number
    volunteers: number
  }>
  trends: Array<{
    month: string
    donations: number
    volunteers: number
    impact: number
  }>
  predictions: Array<{
    month: string
    predicted: number
    confidence: number
  }>
  trustScore: {
    score: number
    indicators: Array<{
      label: string
      status: string
    }>
  }
}

export function generateCSVReport(data: ReportData): string {
  let csv = ''

  // Header
  csv += `Analytics Report\n`
  csv += `Generated: ${data.generatedDate}\n\n`

  // KPIs
  csv += `Key Performance Indicators\n`
  csv += `Title,Value,Trend\n`
  data.kpis.forEach(kpi => {
    csv += `"${kpi.title}","${kpi.value}","${kpi.trend}"\n`
  })
  csv += '\n'

  // Regional Data
  csv += `Regional Performance\n`
  csv += `Region,Issues,Resolved,Volunteers\n`
  data.regions.forEach(region => {
    csv += `"${region.name}",${region.issues},${region.resolved},${region.volunteers}\n`
  })
  csv += '\n'

  // Trends
  csv += `Performance Trends\n`
  csv += `Month,Donations,Volunteers,Impact\n`
  data.trends.forEach(trend => {
    csv += `"${trend.month}",${trend.donations},${trend.volunteers},${trend.impact}\n`
  })
  csv += '\n'

  // Predictions
  csv += `Donation Predictions\n`
  csv += `Month,Predicted Amount,Confidence\n`
  data.predictions.forEach(pred => {
    csv += `"${pred.month}",${pred.predicted},${pred.confidence}%\n`
  })
  csv += '\n'

  // Trust Score
  csv += `Trust Score\n`
  csv += `Score,${data.trustScore.score}/100\n`
  csv += `Indicators\n`
  data.trustScore.indicators.forEach(indicator => {
    csv += `"${indicator.label}","${indicator.status}"\n`
  })

  return csv
}

export function generatePDFReport(data: ReportData): string {
  // Generate a comprehensive PDF-ready HTML content
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Analytics Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 40px;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        h1 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .header-info {
          color: #666;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }
        h2 {
          color: #1f2937;
          margin-top: 30px;
          margin-bottom: 15px;
          font-size: 20px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background-color: #f3f4f6;
          font-weight: 600;
          color: #1f2937;
        }
        tr:hover {
          background-color: #f9fafb;
        }
        .summary {
          background: #f0f9ff;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #3b82f6;
        }
        .summary p {
          margin: 5px 0;
          color: #1e40af;
        }
        @media print {
          body { padding: 20px; }
          .container { max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${data.title}</h1>
        <div class="header-info">
          <p><strong>Generated on:</strong> ${data.generatedDate}</p>
        </div>

        <div class="summary">
          <p><strong>Report Summary:</strong> This comprehensive analytics report includes key performance indicators, regional performance metrics, trend analysis, predictions, and trust score indicators.</p>
        </div>

        <h2>Key Performance Indicators</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            ${data.kpis.map(kpi => `
              <tr>
                <td>${kpi.title}</td>
                <td>${kpi.value}</td>
                <td>${kpi.trend}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Regional Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Region</th>
              <th>Issues</th>
              <th>Resolved</th>
              <th>Volunteers</th>
            </tr>
          </thead>
          <tbody>
            ${data.regions.map(region => `
              <tr>
                <td>${region.name}</td>
                <td>${region.issues}</td>
                <td>${region.resolved}</td>
                <td>${region.volunteers}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Performance Trends</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Donations (₹)</th>
              <th>Volunteers</th>
              <th>Impact</th>
            </tr>
          </thead>
          <tbody>
            ${data.trends.map(trend => `
              <tr>
                <td>${trend.month}</td>
                <td>₹${trend.donations.toLocaleString('en-IN')}</td>
                <td>${trend.volunteers}</td>
                <td>${trend.impact}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Donation Predictions</h2>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Predicted Amount</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            ${data.predictions.map(pred => `
              <tr>
                <td>${pred.month}</td>
                <td>₹${pred.predicted.toLocaleString('en-IN')}</td>
                <td>${pred.confidence}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Trust Score Assessment</h2>
        <table>
          <thead>
            <tr>
              <th>Indicator</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Overall Score</strong></td>
              <td><strong>${data.trustScore.score}/100</strong></td>
            </tr>
            ${data.trustScore.indicators.map(indicator => `
              <tr>
                <td>${indicator.label}</td>
                <td><span style="padding: 4px 8px; background: ${indicator.status === 'verified' ? '#dcfce7' : '#fef3c7'}; border-radius: 4px;">${indicator.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `
  return html
}

export function downloadFile(content: string, filename: string, type: 'text/csv' | 'text/html'): void {
  const blob = new Blob([content], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}
