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
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Main Content Area */}
      <div className="lg:col-span-8 space-y-12">
        <header>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold tracking-widest uppercase">
              {event.category}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400 text-sm font-medium">By {event.organizer}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
            {event.title}
          </h1>
          
          <div className="p-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-transparent to-transparent">
             <div className="bg-[#0f0f12] p-8 rounded-[22px] border border-white/5">
                <AiSummary description={event.description} isDetailPage />
             </div>
          </div>
        </header>

        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-6 flex items-center gap-4">
            Event Intel <div className="h-px flex-1 bg-white/5" />
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed font-light whitespace-pre-line">
            {event.description}
          </p>
        </section>
      </div>

      {/* Action Sidebar */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl">
            <div className="space-y-8 mb-10">
              <div className="group">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 group-hover:text-blue-500 transition-colors">Timestamp</p>
                <p className="text-xl font-semibold text-white">{formattedDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Host Organization</p>
                <p className="text-xl font-semibold text-blue-400">{event.organizer}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={toggleGoing}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-500 ${
                  going 
                    ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]' 
                    : 'bg-white text-black hover:bg-blue-500 hover:text-white'
                }`}
              >
                {going ? '✓ Attending' : 'Secure Spot'}
              </button>
              
              <button
                onClick={toggleInterested}
                className={`w-full py-5 rounded-2xl font-bold text-sm border transition-all duration-300 ${
                  interested 
                    ? 'border-yellow-500/40 bg-yellow-500/5 text-yellow-500' 
                    : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {interested ? '★ In Watchlist' : '☆ Add to Watchlist'}
              </button>
            </div>
          </div>
          
          <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Limited capacity • Secure your spot today
          </p>
        </div>
      </div>
    </div>
  )
}
