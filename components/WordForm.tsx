'use client'

import { useState } from 'react'
import { dictionaryApi } from '@/lib/api'
import type { Priority } from '@/types'

interface WordFormProps {
  onSubmit: (english: string, spanish: string, priority: Priority) => void
  isLoading?: boolean
}

export const WordForm = ({ onSubmit, isLoading = false }: WordFormProps) => {
  const [english, setEnglish] = useState('')
  const [spanish, setSpanish] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleEnglishChange = async (value: string) => {
    setEnglish(value)
    setError('')

    if (value.length > 2) {
      setIsSearching(true)
      try {
        const translation = await dictionaryApi.searchWord(value)
        if (translation) {
          setSpanish(translation)
        }
      } catch {
        setError('No se pudo encontrar la traducción automáticamente')
      } finally {
        setIsSearching(false)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!english.trim() || !spanish.trim()) {
      setError('Por favor completa ambos campos')
      return
    }

    onSubmit(english, spanish, priority)
    setEnglish('')
    setSpanish('')
    setPriority('normal')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Palabra en inglés
        </label>
        <div className="relative">
          <input
            type="text"
            value={english}
            onChange={e => handleEnglishChange(e.target.value)}
            placeholder="Ingresa una palabra..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading || isSearching}
          />
          {isSearching && <div className="absolute right-3 top-3 animate-spin">⏳</div>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Traducción al español
        </label>
        <input
          type="text"
          value={spanish}
          onChange={e => setSpanish(e.target.value)}
          placeholder="Traducción..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Prioridad
        </label>
        <div className="flex gap-2">
          {(['normal', 'frequent', 'always'] as Priority[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 px-3 py-2 rounded-lg font-semibold transition-all ${
                priority === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {p === 'normal' && 'Normal'}
              {p === 'frequent' && 'Frecuente'}
              {p === 'always' && 'Siempre'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <button
        type="submit"
        disabled={isLoading || !english || !spanish}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {isLoading ? 'Guardando...' : 'Agregar palabra'}
      </button>
    </form>
  )
}
