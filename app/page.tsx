'use client'

import { useState, useEffect } from 'react'
import EventList from '@/components/EventList'
import FilterBar from '@/components/FilterBar'
import { loadEvents, rankEvents, Event } from '@/lib/events'
import Link from 'next/link'

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [userPreferences, setUserPreferences] = useState<string[]>([])
  const [showUpcoming, setShowUpcoming] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const allCategories = ['Tech', 'Sports', 'Arts', 'Workshop', 'Social']

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const allEvents = await loadEvents()
      const ranked = rankEvents(allEvents, userPreferences)
      setEvents(ranked)
      setFilteredEvents(ranked)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userPreferences])

  useEffect(() => {
    let filtered = [...events]
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(e => selectedCategories.includes(e.category))
    }
    const now = new Date()
    if (showUpcoming) {
      filtered = filtered.filter(e => new Date(e.date) >= now)
    } else {
      filtered = filtered.filter(e => new Date(e.date) < now)
    }
    setFilteredEvents(filtered)
  }, [selectedCategories, showUpcoming, events])

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 selection:bg-blue-500/30">
      {/* Background Glow Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-[#0a0a0c]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
            <span className="text-xl font-black tracking-tighter uppercase">
              Uni<span className="text-blue-500">Event</span>
            </span>
          </Link>
          <Link 
            href="/admin" 
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/5 transition-all"
          >
            Access Portal
          </Link>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Hero Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
            Experience Your <br /> Campus Life.
          </h1>
          <p className="text-lg text-gray-400 max-w-xl font-light">
            An intelligent gateway to the best tech, sports, and arts events happening across the university.
          </p>
        </div>

        {/* Interests Section - Glassmorphism */}
        <section className="relative overflow-hidden mb-12 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-1">Tailored for You</h2>
              <p className="text-gray-400 text-sm">Select categories to refine your AI ranking.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    if (userPreferences.includes(cat)) {
                      setUserPreferences(userPreferences.filter(c => c !== cat))
                    } else {
                      setUserPreferences([...userPreferences, cat])
                    }
                  }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                    userPreferences.includes(cat)
                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="sticky top-24">
              <div className="p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="bg-[#0f0f12] rounded-[14px] p-6">
                  <FilterBar
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={setSelectedCategories}
                    showUpcoming={showUpcoming}
                    onDateFilterChange={setShowUpcoming}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Event List */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
                </div>
                <p className="mt-6 text-gray-500 font-medium tracking-widest uppercase text-[10px]">Initializing Feed...</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <EventList events={filteredEvents} userPreferences={userPreferences} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
