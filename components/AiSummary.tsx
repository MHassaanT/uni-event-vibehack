import { generateSummary } from '@/lib/events'

interface AiSummaryProps {
  description: string
  isDetailPage?: boolean
}

export default function AiSummary({ description, isDetailPage = false }: AiSummaryProps) {
  const summary = generateSummary(description)

  return (
    <div className={`
      relative overflow-hidden transition-all duration-500
      ${isDetailPage 
        ? 'bg-blue-500/[0.03] border border-blue-500/20 p-6 rounded-[24px] backdrop-blur-md' 
        : 'mt-2'
      }
    `}>
      {/* Subtle Glow Effect for Detail Page */}
      {isDetailPage && (
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500/10 blur-[40px] pointer-events-none" />
      )}

      <div className="flex items-start gap-4">
        {/* Animated AI Icon Container */}
        <div className="relative flex-shrink-0 mt-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/80">
            {isDetailPage ? 'Intelligence Briefing' : 'AI Summary'}
          </span>
          
          <p className={`
            leading-relaxed font-medium
            ${isDetailPage 
              ? 'text-gray-300 text-base' 
              : 'text-gray-400 text-xs line-clamp-2'
            }
          `}>
            {summary}
          </p>
        </div>
      </div>
    </div>
  )
}
