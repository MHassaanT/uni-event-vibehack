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
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">🔍 Filters</h2>
      
      {/* Date Filter */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Timeline
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onDateFilterChange(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              showUpcoming
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => onDateFilterChange(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              !showUpcoming
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                selectedCategories.includes(cat)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {selectedCategories.length > 0 && (
          <button
            onClick={() => onCategoryChange([])}
            className="mt-2 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}