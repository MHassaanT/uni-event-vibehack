import { generateSummary } from '@/lib/events'

interface AiSummaryProps {
  description: string
  isDetailPage?: boolean
}

export default function AiSummary({ description, isDetailPage = false }: AiSummaryProps) {
  const summary = generateSummary(description)

  return (
    <div className={`${isDetailPage ? 'bg-blue-50 p-4 rounded-lg' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="text-blue-600 font-medium text-sm">
          {isDetailPage ? '🤖 AI-Generated Summary (mock):' : '🤖'}
        </span>
        <p className={`text-gray-700 ${isDetailPage ? 'text-base' : 'text-sm line-clamp-2'}`}>
          {summary}
        </p>
      </div>
    </div>
  )
}