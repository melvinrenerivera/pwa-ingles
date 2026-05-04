'use client'

import { useState } from 'react'
import type { Word } from '@/types'

interface PriorityListProps {
  words: Word[]
  onDelete: (id: string) => void
}

export const PriorityList = ({ words, onDelete }: PriorityListProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredWords = words.filter(word => {
    const matchesSearch =
      word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.spanish.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getPriorityLabel = (priority: string): string => {
    const labels: Record<string, string> = {
      normal: 'Normal',
      frequent: 'Frecuente',
      always: 'Siempre',
    }
    return labels[priority] || priority
  }

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-100 hover:bg-gray-200',
      frequent: 'bg-blue-100 hover:bg-blue-200',
      always: 'bg-purple-100 hover:bg-purple-200',
    }
    return colors[priority] || 'bg-gray-100'
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar palabra..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {filteredWords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay palabras que coincidan
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWords.map(word => (
            <div
              key={word.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${getPriorityColor(
                word.priority
              )}`}
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{word.english}</div>
                <div className="text-sm text-gray-600">{word.spanish}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 min-w-20">
                  {getPriorityLabel(word.priority)}
                </span>

                <button
                  onClick={() => onDelete(word.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        {filteredWords.length} de {words.length} palabras
      </div>
    </div>
  )
}
