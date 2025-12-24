'use client'

interface FilterBarProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
  showUpcoming: boolean
  onDateFilterChange: (showUpcoming: boolean) => void
}

export default function FilterBar({
  categories,
  selectedCategories,
  onCategoryChange,
  showUpcoming,
  onDateFilterChange
}: FilterBarProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  return (
    <div className="space-y-8">
      {/* Timeline Section */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
          Timeline
        </h2>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Upcoming Events', value: true },
            { label: 'Past Archives', value: false }
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => onDateFilterChange(opt.value)}
              className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all duration-300 ${
                showUpcoming === opt.value
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-4">
          Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border ${
                selectedCategories.includes(cat)
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                  : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
