'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import {
  generateCSVReport,
  generatePDFReport,
  downloadFile,
  type ReportData,
} from '@/lib/report-generator'

interface ReportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportData: ReportData
}

export function ReportExportDialog({
  open,
  onOpenChange,
  reportData,
}: ReportExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const csv = generateCSVReport(reportData)
      const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
      downloadFile(csv, filename, 'text/csv')
    } finally {
      setIsExporting(false)
      onOpenChange(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const html = generatePDFReport(reportData)
      const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.html`
      downloadFile(html, filename, 'text/html')
    } finally {
      setIsExporting(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Choose a format to download your analytics report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-3" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Export as CSV</span>
              <span className="text-xs text-muted-foreground">
                Spreadsheet format for data analysis
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            <FileText className="h-4 w-4 mr-3" />
            <div className="flex flex-col items-start">
              <span className="font-medium">Export as PDF</span>
              <span className="text-xs text-muted-foreground">
                Formatted document for sharing and printing
              </span>
            </div>
          </Button>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
