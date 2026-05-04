'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import type { Priority } from '@/types'

const PRIORITY_LABELS: Record<Priority, string> = {
  normal: 'Normal',
  frequent: 'Frecuente',
  always: 'Siempre',
}

const PRIORITY_COLORS: Record<Priority, string> = {
  normal: 'text-gray-400',
  frequent: 'text-blue-400',
  always: 'text-purple-400',
}

const PRIORITY_ICONS: Record<Priority, string> = {
  normal: '○',
  frequent: '◑',
  always: '●',
}

const NEXT_PRIORITY: Record<Priority, Priority> = {
  normal: 'frequent',
  frequent: 'always',
  always: 'normal',
}

export default function WordsPage() {
  const { words, loadWords, updateWord, deleteWord } = useStore()
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    loadWords()
  }, [])

  const handleTogglePriority = (id: string, current: Priority) => {
    updateWord(id, { priority: NEXT_PRIORITY[current] })
  }

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return }
    words.forEach(w => updateWord(w.id, { priority: 'normal' }))
    setConfirmReset(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 pb-24">
      <div className="max-w-md mx-auto px-4 pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Mis Palabras</h1>
            <p className="text-blue-300 text-sm mt-0.5">{words.length} palabras guardadas</p>
          </div>
          {words.length > 0 && (
            <button
              onClick={handleReset}
              onBlur={() => setConfirmReset(false)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                confirmReset
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-blue-300 border border-white/10'
              }`}
            >
              {confirmReset ? '¿Confirmar reset?' : '↺ Reset frecuencias'}
            </button>
          )}
        </div>

        {/* Legend */}
        {words.length > 0 && (
          <div className="flex gap-4 mb-4 text-xs text-blue-300">
            <span className="flex items-center gap-1"><span className="text-gray-400">○</span> Normal</span>
            <span className="flex items-center gap-1"><span className="text-blue-400">◑</span> Frecuente</span>
            <span className="flex items-center gap-1"><span className="text-purple-400">●</span> Siempre</span>
            <span className="ml-auto">Toca el icono para cambiar</span>
          </div>
        )}

        {/* Word list */}
        {words.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-blue-200 mb-2">No tienes palabras aún</p>
            <Link
              href="/add-word"
              className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold"
            >
              ➕ Agregar primera palabra
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {words.map((word, i) => (
              <div
                key={word.id}
                className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3.5 backdrop-blur"
              >
                {/* Number */}
                <span className="text-xs text-white/30 w-5 text-right flex-shrink-0">{i + 1}</span>

                {/* Word + translation */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base truncate">{word.english}</p>
                  <p className="text-blue-300 text-sm truncate">{word.spanish}</p>
                </div>

                {/* Priority toggle */}
                <button
                  onClick={() => handleTogglePriority(word.id, word.priority)}
                  className={`text-xl flex-shrink-0 transition-transform active:scale-90 ${PRIORITY_COLORS[word.priority]}`}
                  title={`${PRIORITY_LABELS[word.priority]} — toca para cambiar`}
                >
                  {PRIORITY_ICONS[word.priority]}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteWord(word.id)}
                  className="text-red-400 hover:text-red-300 flex-shrink-0 text-lg transition-colors active:scale-90"
                  title="Eliminar"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
