'use client'

import { useState, useEffect } from 'react'
import { createEvent, updateEvent, deleteEventById, loadEvents, Event } from '@/lib/events'

export default function AdminForm({ onEventCreated }: { onEventCreated: () => void }) {
  const [formData, setFormData] = useState({
    title: '', 
    date: '', 
    category: 'Tech', 
    organizer: '', 
    description: '', 
    popularityScore: 5
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const refreshList = async () => {
    const data = await loadEvents()
    setAllEvents(data.filter(e => e.id.length > 15 || e.id.startsWith('event_')))
  }

  useEffect(() => { refreshList() }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingId) {
        await updateEvent(editingId, formData)
      } else {
        await createEvent(formData)
      }
      setFormData({ title: '', date: '', category: 'Tech', organizer: '', description: '', popularityScore: 5 })
      setEditingId(null)
      await refreshList()
      onEventCreated()
    } catch (error) {
      console.error("Error saving event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyles = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder:text-gray-600"

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
      {/* Form Section */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md h-fit">
        <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-600 rounded-full" />
          {editingId ? 'Edit Event Data' : 'Initialize New Event'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Event Title</label>
            <input type="text" required placeholder="Quantum Workshop 2024" className={inputStyles} 
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Organized By</label>
              <input type="text" required placeholder="University Tech Club" className={inputStyles} 
                value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Event Date</label>
              <input type="date" required className={inputStyles} 
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Category</label>
              <select className={inputStyles} value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}>
                {['Tech', 'Sports', 'Arts', 'Workshop', 'Social'].map(c => <option key={c} value={c} className="bg-[#0a0a0c]">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Popularity Scale (1-10)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="10" className="flex-1 accent-blue-600" 
                  value={formData.popularityScore} onChange={e => setFormData({...formData, popularityScore: parseInt(e.target.value)})} />
                <span className="text-blue-400 font-bold w-4">{formData.popularityScore}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Event Description</label>
            <textarea rows={4} required className={`${inputStyles} resize-none`} placeholder="Describe the mission..." 
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex gap-4">
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({title: '', date: '', category: 'Tech', organizer: '', description: '', popularityScore: 5}) }}
                className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Cancel
              </button>
            )}
            <button disabled={isSubmitting} className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50">
              {isSubmitting ? 'Processing...' : editingId ? 'Sync Updates' : 'Deploy Event'}
            </button>
          </div>
        </form>
      </div>

      {/* Management List Section */}
      <div className="space-y-6">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Active Database</h3>
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {allEvents.length === 0 ? (
            <p className="text-gray-600 italic text-sm">No modifiable events found.</p>
          ) : (
            allEvents.map(event => (
              <div key={event.id} className="group bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{event.title}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                    {event.category} • {event.date} • {event.organizer}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(event)} className="px-4 py-2 bg-white/5 text-gray-400 text-xs font-bold rounded-lg hover:bg-white/10 hover:text-white transition-all">Edit</button>
                  <button onClick={async () => {
                    if(confirm('Permanent Deletion: Are you sure?')) {
                      await deleteEventById(event.id);
                      await refreshList();
                    }
                  }} className="px-4 py-2 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
