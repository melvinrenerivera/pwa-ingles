'use client'

import { useState } from 'react'
import type { Word, Priority } from '@/types'

interface WordCardItemProps {
  word: Word
  onDelete: () => void
  onPriorityChange: (priority: Priority) => void
}

const priorityLabels: Record<Priority, string> = {
  'normal': 'Normal',
  'frequent': 'Frecuente',
  'always': 'Siempre',
}

const priorityBgColors: Record<Priority, string> = {
  'normal': 'bg-gray-100 hover:bg-gray-200',
  'frequent': 'bg-blue-100 hover:bg-blue-200',
  'always': 'bg-purple-100 hover:bg-purple-200',
}

const priorityTextColors: Record<Priority, string> = {
  'normal': 'text-gray-700',
  'frequent': 'text-blue-700',
  'always': 'text-purple-700',
}

export const WordCardItem = ({
  word,
  onDelete,
  onPriorityChange,
}: WordCardItemProps) => {
  const [showOptions, setShowOptions] = useState(false)

  const handlePriorityChange = (priority: Priority) => {
    onPriorityChange(priority)
    setShowOptions(false)
  }

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${priorityBgColors[word.priority]}`}
    >
      {/* Contenido */}
      <div className="space-y-4">
        {/* Palabra y traducción */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{word.english}</h3>
          <p className={`text-lg font-semibold mt-2 ${priorityTextColors[word.priority]}`}>
            {word.spanish}
          </p>
        </div>

        {/* Prioridad actual */}
        <div className="pt-2 border-t border-current border-opacity-20">
          <p className="text-xs font-semibold text-gray-500 mb-2">PRIORIDAD</p>
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition-all ${
                word.priority === 'normal'
                  ? 'bg-gray-200 text-gray-700'
                  : word.priority === 'frequent'
                    ? 'bg-blue-200 text-blue-700'
                    : 'bg-purple-200 text-purple-700'
              }`}
            >
              {priorityLabels[word.priority]}
            </button>

            {/* Dropdown de opciones */}
            {showOptions && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
                {(['normal', 'frequent', 'always'] as Priority[]).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePriorityChange(p)}
                    className={`w-full px-4 py-3 text-left font-semibold transition-colors ${
                      p === 'normal'
                        ? 'hover:bg-gray-100 text-gray-700'
                        : p === 'frequent'
                          ? 'hover:bg-blue-100 text-blue-700'
                          : 'hover:bg-purple-100 text-purple-700'
                    } ${word.priority === p ? 'bg-opacity-20 bg-gray-300' : ''}`}
                  >
                    {priorityLabels[p]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={onDelete}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  )
}
