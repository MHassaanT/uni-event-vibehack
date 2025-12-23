'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Event } from '@/lib/events'
import AiSummary from './AiSummary'

interface EventDetailProps {
  event: Event
}

export default function EventDetail({ event }: EventDetailProps) {
  const router = useRouter()
  const [interested, setInterested] = useState(false)
  const [going, setGoing] = useState(false)

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedInterested = localStorage.getItem(`event_${event.id}_interested`)
    const savedGoing = localStorage.getItem(`event_${event.id}_going`)
    
    if (savedInterested) setInterested(savedInterested === 'true')
    if (savedGoing) setGoing(savedGoing === 'true')
  }, [event.id])

  const toggleInterested = () => {
    const newValue = !interested
    setInterested(newValue)
    localStorage.setItem(`event_${event.id}_interested`, String(newValue))
  }

  const toggleGoing = () => {
    const newValue = !going
    setGoing(newValue)
    localStorage.setItem(`event_${event.id}_going`, String(newValue))
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
      >
        ← Back to Events
      </button>

      {/* Event card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Category badge */}
        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
          {event.category}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {event.title}
        </h1>

        {/* AI Summary */}
        <div className="mb-6">
          <AiSummary description={event.description} isDetailPage />
        </div>

        {/* Meta info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600 mb-1">📅 Date & Time</div>
            <div className="font-medium text-gray-900">{formattedDate}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">👤 Organizer</div>
            <div className="font-medium text-gray-900">{event.organizer}</div>
          </div>
        </div>

        {/* Full description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            About This Event
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={toggleInterested}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              interested
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {interested ? '⭐ Interested' : '☆ Mark Interested'}
          </button>
          <button
            onClick={toggleGoing}
            className={`flex-1 py-3 rounded-lg font-medium transition ${
              going
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {going ? '✓ Going' : 'Mark Going'}
          </button>
        </div>
      </div>
    </div>
  )
}