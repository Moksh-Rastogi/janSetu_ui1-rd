import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface UrgentBannerProps {
  title: string
  description: string
  action?: {
    label: string
    href?: string
  }
  onDismiss?: () => void
}

export function UrgentBanner({
  title,
  description,
  action,
  onDismiss,
}: UrgentBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  return (
    <div className="rounded-lg border-l-4 border-l-destructive bg-destructive/10 p-4 flex items-start justify-between gap-4">
      <div className="flex gap-3 flex-1">
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          {action && (
            <Button
              variant="link"
              className="h-auto p-0 mt-2 text-sm text-destructive hover:text-destructive/90"
              asChild={!!action.href}
            >
              {action.href ? (
                <a href={action.href}>{action.label}</a>
              ) : (
                <span>{action.label}</span>
              )}
            </Button>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
