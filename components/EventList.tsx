import { Event } from '@/lib/events'
import EventCard from './EventCard'

interface EventListProps {
  events: Event[]
  userPreferences: string[]
}

export default function EventList({ events, userPreferences }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No events found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or check back later for new events!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          userPreferences={userPreferences}
        />
      ))}
    </div>
  )
}