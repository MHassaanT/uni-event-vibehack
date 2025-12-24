import Link from 'next/link'
import { Event } from '@/lib/events'
import AiSummary from './AiSummary'

interface EventCardProps {
  event: Event
  userPreferences: string[]
}

export default function EventCard({ event, userPreferences }: EventCardProps) {
  const now = new Date()
  const eventDate = new Date(event.date)
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const isHappeningSoon = daysUntil >= 0 && daysUntil <= 3
  const isPopular = (event.popularityScore || 0) >= 8
  const isRecommended = userPreferences.includes(event.category)

  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <Link href={`/event/${event.id}`}>
      <div className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-6 transition-all duration-500 hover:bg-white/[0.06] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] cursor-pointer h-full flex flex-col overflow-hidden">
        {/* Animated Glow on Hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
        
        <div className="relative flex flex-wrap gap-2 mb-4">
          {isHappeningSoon && (
            <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-orange-500/20">
              ⏰ Soon
            </span>
          )}
          {isPopular && (
            <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-red-500/20">
              🔥 Popular
            </span>
          )}
          {isRecommended && (
            <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-500/20">
              ⭐ Pick
            </span>
          )}
        </div>

        <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>

        <div className="relative mb-4 opacity-80">
          <AiSummary description={event.description} />
        </div>

        <div className="relative mt-auto pt-4 border-t border-white/5 space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-blue-500/80">📅</span> {formattedDate}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500/80">🏷️</span> {event.category}
          </div>
        </div>
      </div>
    </Link>
  )
}
