'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import EventDetail from '@/components/EventDetail'
import { loadEvents, Event } from '@/lib/events'

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)

  useEffect(() => {
    const events = loadEvents()
    const found = events.find(e => e.id === params.id)
    if (found) {
      setEvent(found)
    }
  }, [params.id])

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event not found</h2>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:underline"
          >
            ← Back to events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <EventDetail event={event} />
    </div>
  )
}