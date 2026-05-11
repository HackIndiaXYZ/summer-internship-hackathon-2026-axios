import { jsPDF } from "jspdf"
import type { AnalysisHistoryItem } from "@/lib/store"

function slugifyRepo(name: string): string {
  return name.replace(/[^\w.-]+/g, "_").slice(0, 80) || "scan"
}

export function downloadScanPdf(item: AnalysisHistoryItem): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 48
  const maxW = pageW - margin * 2
  let y = 56

  const addParagraph = (text: string, fontSize = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal")
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxW) as string[]
    for (const ln of lines) {
      if (y > doc.internal.pageSize.getHeight() - 56) {
        doc.addPage()
        y = 56
      }
      doc.text(ln, margin, y)
      y += fontSize * 1.35
    }
    y += 4
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("Vigilix AI — Scan report", margin, y)
  y += 28

  addParagraph(`Repository: ${item.repository}`, 12, true)
  addParagraph(
    `Trust score: ${item.score}   Status: ${item.status}   Mode: ${item.mode}`,
    11
  )
  addParagraph(
    `Scanned files: ${item.scannedFiles}   Timestamp: ${new Date(item.timestamp).toLocaleString()}`,
    10
  )

  addParagraph("Issues and recommendations", 13, true)

  if (!item.issues.length) {
    addParagraph("No issues recorded for this scan.", 10)
  } else {
    item.issues.forEach((issue, idx) => {
      addParagraph(`${idx + 1}. ${issue.title} (${issue.severity})`, 11, true)
      addParagraph(`${issue.file} — line ${issue.line}`, 9)
      addParagraph(`Risk: ${issue.explanation}`, 10)
      addParagraph(`Recommendation: ${issue.recommendation}`, 10)
      addParagraph(`AI insight: ${issue.aiInsight}`, 10)
      addParagraph(
        `Trust impact: -${issue.trustImpact}   Original: ${issue.originalCode.slice(0, 200)}${issue.originalCode.length > 200 ? "…" : ""}`,
        9
      )
      addParagraph(`Secure rewrite: ${issue.secureCode.slice(0, 200)}${issue.secureCode.length > 200 ? "…" : ""}`, 9)
      y += 6
    })
  }

  doc.save(`vigilix-${slugifyRepo(item.repository)}.pdf`)
}
