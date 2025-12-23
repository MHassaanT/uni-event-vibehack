'use client'

import { useState, useEffect } from 'react'
import { createEvent, updateEvent, deleteEventById, loadEvents, Event } from '@/lib/events'

interface AdminFormProps {
  onEventCreated: () => void
}

export default function AdminForm({ onEventCreated }: AdminFormProps) {
  // 1. Form State with all required fields
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: 'Tech',
    organizer: '',
    description: '',
    popularityScore: 5
  })

  // 2. UI State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ['Tech', 'Sports', 'Arts', 'Workshop', 'Social']

  // Load events from Firestore on mount
  const refreshList = async () => {
    const data = await loadEvents()
    // We only want to show events that can be edited (those in Firestore)
    // Firestore IDs are usually long strings, unlike our static JSON IDs
    setAllEvents(data.filter(e => e.id.length > 15 || e.id.startsWith('event_')))
  }

  useEffect(() => {
    refreshList()
  }, [])

  // 3. Handle Form Submission (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (editingId) {
        await updateEvent(editingId, formData)
        setEditingId(null)
      } else {
        await createEvent(formData)
      }
      
      // Reset form
      setFormData({
        title: '',
        date: '',
        category: 'Tech',
        organizer: '',
        description: '',
        popularityScore: 5
      })

      await refreshList()
      onEventCreated()
    } catch (error) {
      console.error("Error saving event:", error)
      alert("Failed to save event. Check console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingId(event.id)
    setFormData({
      title: event.title,
      date: event.date,
      category: event.category,
      organizer: event.organizer,
      description: event.description,
      popularityScore: event.popularityScore || 5
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      {/* FORM SECTION */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {editingId ? '📝 Edit Existing Event' : '✨ Create New Event'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                required
                type="date"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full p-2 border rounded-lg outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organized By</label>
              <input
                required
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.organizer}
                onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                placeholder="Club or Department"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Popularity Score (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={formData.popularityScore}
              onChange={(e) => setFormData({...formData, popularityScore: parseInt(e.target.value)})}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low Interest</span>
              <span className="font-bold text-blue-600">Current: {formData.popularityScore}</span>
              <span>High Interest</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-lg font-bold text-white transition-all ${
                editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update Event' : 'Publish Event'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ title: '', date: '', category: 'Tech', organizer: '', description: '', popularityScore: 5 })
                }}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* MANAGEMENT LIST */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🛠️ Manage Existing Events</h3>
        <div className="space-y-3">
          {allEvents.length === 0 ? (
            <p className="text-gray-500 italic">No events found in the database.</p>
          ) : (
            allEvents.map(event => (
              <div key={event.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <h4 className="font-bold text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">
                    {event.date} • {event.category} • By {event.organizer}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      if(confirm('Are you sure? This will remove the event for everyone.')) {
                        await deleteEventById(event.id);
                        await refreshList();
                        onEventCreated();
                      }
                    }}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}