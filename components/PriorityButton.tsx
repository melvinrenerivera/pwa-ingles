'use client'

import type { Priority } from '@/types'

interface PriorityButtonProps {
  priority: Priority
  selected?: boolean
  onClick: () => void
  disabled?: boolean
}

const priorityLabels: Record<Priority, string> = {
  'normal': 'Normal',
  'frequent': 'Frecuente',
  'always': 'Siempre',
}

const priorityColors: Record<Priority, { bg: string; text: string }> = {
  'normal': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'frequent': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'always': { bg: 'bg-purple-100', text: 'text-purple-700' },
}

export const PriorityButton = ({
  priority,
  selected = false,
  onClick,
  disabled = false,
}: PriorityButtonProps) => {
  const colors = priorityColors[priority]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform ${
        selected
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
          : `${colors.bg} ${colors.text} hover:shadow-md hover:scale-102`
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'} min-h-[44px]`}
      aria-label={`Prioridad ${priorityLabels[priority]}`}
    >
      {priorityLabels[priority]}
    </button>
  )
}
