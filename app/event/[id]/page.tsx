'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import EventDetail from '@/components/EventDetail'
import { loadEvents, Event } from '@/lib/events'

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create an async function inside useEffect
    const fetchEvent = async () => {
      try {
        setLoading(true)
        // Await the promise to get the actual array of events
        const events = await loadEvents() 
        const found = events.find(e => e.id === params.id)
        
        if (found) {
          setEvent(found)
        }
      } catch (error) {
        console.error("Error loading event:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

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
