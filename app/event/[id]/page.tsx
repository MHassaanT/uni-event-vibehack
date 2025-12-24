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
    const fetchEvent = async () => {
      try {
        setLoading(true)
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
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:text-blue-400 font-bold uppercase tracking-widest text-xs"
          >
            ← Back to Discovery
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-blue-500/30">
      {/* Background Detail Accent */}
      <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push('/')}
          className="group mb-12 text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Discovery
        </button>

        {/* Pass the event data to the detailed component */}
        <EventDetail event={event} />
      </div>
    </div>
  )
}
