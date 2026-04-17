'use client'

import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface AIInsightCardProps {
  suggestedAction: string
  priorityScore: number
  prediction: string
}

export function AIInsightCard({ suggestedAction, priorityScore, prediction }: AIInsightCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div
      className={cn(
        'absolute bottom-4 left-2 sm:left-4 z-30 w-[calc(100%-1rem)] sm:w-72 md:w-80',
        'bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl',
        'transition-all duration-300 ease-out overflow-hidden'
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-white">AI Insights</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-white/60" />
        ) : (
          <ChevronUp className="h-4 w-4 text-white/60" />
        )}
      </button>

      {/* Content */}
      <div
        className={cn(
          'transition-all duration-300 ease-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4 space-y-4">
          {/* Suggested Action */}
          <div className="space-y-1">
            <p className="text-xs text-white/50 uppercase tracking-wide">Suggested Action</p>
            <p className="text-sm text-white font-medium">{suggestedAction}</p>
          </div>

          {/* Priority Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/50 uppercase tracking-wide">Priority Score</p>
              <span className="text-sm font-semibold text-white">{priorityScore}%</span>
            </div>
            <Progress
              value={priorityScore}
              className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary/70"
            />
          </div>

          {/* Prediction */}
          <div className="space-y-1">
            <p className="text-xs text-white/50 uppercase tracking-wide">Prediction</p>
            <p className="text-sm text-white/80">{prediction}</p>
          </div>

          {/* Action Button */}
          <Button
            size="sm"
            className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30"
          >
            View Full Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
