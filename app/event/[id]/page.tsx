// Only showing the return section for brevity, apply to page (7).tsx
return (
  <div className="min-h-screen bg-[#0a0a0c] text-white">
    {/* Background Detail Accent */}
    <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] -z-10" />
    
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button
        onClick={() => router.push('/')}
        className="group mb-12 text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Discovery
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Title & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
              {event.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              {event.title}
            </h1>
            <AiSummary description={event.description} isDetailPage />
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600" /> Event Briefing
            </h2>
            <p className="text-gray-400 leading-relaxed text-lg font-light">
              {event.description}
            </p>
          </div>
        </div>

        {/* Right Column: Actions & Meta */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Date & Time</p>
                <p className="text-lg font-medium">{formattedDate}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Hosted By</p>
                <p className="text-lg font-medium text-blue-400">{event.organizer}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={toggleInterested}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  interested 
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {interested ? '★ Watchlisted' : '☆ Add to Watchlist'}
              </button>
              <button
                onClick={toggleGoing}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  going 
                    ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)]' 
                    : 'bg-blue-600/80 text-white hover:bg-blue-600'
                }`}
              >
                {going ? '✓ You are going' : 'Confirm Attendance'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)
