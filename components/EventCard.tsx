import Link from 'next/link'
import { Event } from '@/lib/events'
import AiSummary from './AiSummary'

interface EventCardProps {
  event: Event
  userPreferences: string[]
}

export default function EventCard({ event, userPreferences }: EventCardProps) {
  // Calculate days until event
  const now = new Date()
  const eventDate = new Date(event.date)
  const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const isHappeningSoon = daysUntil >= 0 && daysUntil <= 3
  const isPopular = (event.popularityScore || 0) >= 8
  const isRecommended = userPreferences.includes(event.category)

  // Format date
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <Link href={`/event/${event.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 cursor-pointer h-full flex flex-col">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isHappeningSoon && (
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              ⏰ Happening Soon
            </span>
          )}
          {isPopular && (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              🔥 Popular
            </span>
          )}
          {isRecommended && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              ⭐ Recommended
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* AI Summary */}
        <AiSummary description={event.description} />

        {/* Meta info */}
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="font-medium mr-2">📅</span>
            {formattedDate}
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">🏷️</span>
            {event.category}
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">👤</span>
            {event.organizer}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* View details */}
        <div className="mt-4 text-blue-600 font-medium text-sm hover:underline">
          View Details →
        </div>
      </div>
    </Link>
  )
}