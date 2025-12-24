'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth, signInWithEmail, signInWithGoogle, signOut } from '@/lib/auth'
import AdminForm from './AdminForm'
import Link from 'next/link'

export default function AuthGate() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmail(email, password, false)
    } catch (err: any) {
      setError(err.message || 'Access Denied')
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (user) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">COMMAND CENTER</h1>
            <p className="text-blue-500 font-mono text-xs mt-2 uppercase tracking-[0.3em]">Authorized Access Only: {user.email}</p>
          </div>
          <button 
            onClick={() => signOut()}
            className="text-xs font-bold uppercase tracking-widest text-red-500 border border-red-500/20 px-6 py-2 rounded-full hover:bg-red-500/10 transition-all"
          >
            Terminate Session
          </button>
        </div>
        <AdminForm onEventCreated={() => {}} />
      </main>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-6">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[32px] p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl rotate-12 mx-auto mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">Admin Portal</h2>
          <p className="text-gray-500 text-sm mt-2">Enter credentials to manage campus events</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input 
            type="email" placeholder="Admin Email" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Secure Password" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="text-red-400 text-xs font-bold text-center uppercase tracking-widest">{error}</p>}

          <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 hover:text-white transition-all duration-300">
            Authorize Access
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0f0f12] px-4 text-gray-500 font-bold tracking-[0.2em]">OR</span></div>
        </div>

        <button 
          onClick={() => signInWithGoogle()}
          className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.8" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity="0.8" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.8" />
          </svg>
          Google Identity
        </button>

        <Link href="/" className="block text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-blue-500 transition-colors">
          Return to Discovery
        </Link>
      </div>
    </div>
  )
}
