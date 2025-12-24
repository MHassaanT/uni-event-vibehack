'use client'

import AuthGate from '@/components/AuthGate'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] selection:bg-blue-500/30">
      {/* Shared Background Orbs for Consistency */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
        <div className="absolute bottom-[0%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <AuthGate />
      </div>
    </div>
  )
}
