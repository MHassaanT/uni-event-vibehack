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

  // 1. Fetch data from Firestore + Static JSON
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const allEvents = await loadEvents() // Call the new async function
      const ranked = rankEvents(allEvents, userPreferences)
      setEvents(ranked)
      setFilteredEvents(ranked)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load events on mount and whenever user preferences change
  useEffect(() => {
    fetchData()
  }, [userPreferences])

  // 2. Apply local filtering (Category & Date)
  useEffect(() => {
    let filtered = [...events]

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(e => selectedCategories.includes(e.category))
    }

    // Date filter (upcoming vs past)
    const now = new Date()
    if (showUpcoming) {
      filtered = filtered.filter(e => new Date(e.date) >= now)
    } else {
      filtered = filtered.filter(e => new Date(e.date) < now)
    }

    setFilteredEvents(filtered)
  }, [selectedCategories, showUpcoming, events])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
            UniEvent
          </Link>
          <Link 
            href="/admin" 
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Admin Panel
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Campus Events</h1>
          <p className="text-gray-600">Discover what's happening around your university.</p>
        </div>

        {/* Category Preferences */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            🎯 Your Interests <span className="text-xs font-normal text-gray-400">(Personalizes your feed)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  userPreferences.includes(cat)
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filters & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <FilterBar
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              showUpcoming={showUpcoming}
              onDateFilterChange={setShowUpcoming}
            />
          </div>

          {/* Event List Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p>Syncing with campus database...</p>
              </div>
            ) : (
              <EventList events={filteredEvents} userPreferences={userPreferences} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}