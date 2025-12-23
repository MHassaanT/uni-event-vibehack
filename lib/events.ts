import { db } from './firebase'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore'
import staticEvents from '@/data/events.json'

export interface Event {
  id: string
  title: string
  date: string
  category: string
  organizer: string
  description: string
  popularityScore?: number
  rankScore?: number
}

/**
 * Fetch all events (Static JSON + Firestore)
 */
export async function loadEvents(): Promise<Event[]> {
  const static_events = staticEvents as Event[]
  
  if (typeof db === 'undefined' || !db) return static_events

  try {
    const eventsCol = collection(db, 'events')
    const eventSnapshot = await getDocs(query(eventsCol, orderBy('date', 'asc')))
    const firestoreEvents = eventSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Event[]

    return [...firestoreEvents, ...static_events]
  } catch (error) {
    console.error("Error loading events:", error)
    return static_events
  }
}

export async function createEvent(data: Omit<Event, 'id'>) {
  const eventsCol = collection(db, 'events')
  const docRef = await addDoc(eventsCol, data)
  return { id: docRef.id, ...data }
}

export async function updateEvent(id: string, data: Partial<Event>) {
  const eventDoc = doc(db, 'events', id)
  await updateDoc(eventDoc, data)
}

export async function deleteEventById(id: string) {
  const eventDoc = doc(db, 'events', id)
  await deleteDoc(eventDoc)
}

// Helper for ranking remains synchronous as it processes data already fetched
export function rankEvents(events: Event[], userPreferences: string[]): Event[] {
  const now = new Date()
  const ranked = events.map(event => {
    const eventDate = new Date(event.date)
    const daysUntil = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    let score = 0
    if (daysUntil >= 0 && daysUntil <= 7) score += 15
    if ((event.popularityScore || 0) >= 8) score += 20
    if (userPreferences.includes(event.category)) score += 10
    return { ...event, rankScore: score - Math.abs(daysUntil) * 0.5 }
  })
  return ranked.sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0))
}

export function generateSummary(description: string): string {
  const sentences = description.split(/[.!?]+/).filter(s => s.trim().length > 0)
  if (sentences.length === 0) return description.substring(0, 100) + '...'
  let summary = sentences[0].trim()
  if (sentences.length > 1) {
    summary += '. ' + sentences[1].trim().split(' ').slice(0, 10).join(' ') + '...'
  }
  return summary
}