'use client'

import { useState } from 'react'
import { useWords } from '@/hooks/useWords'
import { WordFormNew } from '@/components/WordFormNew'
import type { Priority } from '@/types'

export default function AddWordPage() {
  const { addWord } = useWords()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (english: string, spanish: string, priority: Priority) => {
    setIsLoading(true)
    try {
      addWord(english, spanish, priority)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 pb-24">
      <div className="flex flex-col justify-center px-4 py-8 max-w-md mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✏️</div>
          <h1 className="text-2xl font-bold text-white">Agregar Palabra</h1>
          <p className="text-blue-300 text-sm mt-1">
            Escribe en inglés — traducimos automáticamente
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-6 shadow-xl">
          <WordFormNew onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Tips */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: '⚡', text: 'Normal = 1×' },
            { icon: '🔥', text: 'Frecuente = 3×' },
            { icon: '⭐', text: 'Siempre = 5×' },
          ].map(tip => (
            <div key={tip.text} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-lg mb-1">{tip.icon}</div>
              <p className="text-blue-300 text-xs">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
