'use client'

import { useState, useEffect, useRef } from 'react'
import { dictionaryApi } from '@/lib/api'
import type { Priority } from '@/types'

interface WordFormNewProps {
  onSubmit: (english: string, spanish: string, priority: Priority) => void
  isLoading?: boolean
}

export const WordFormNew = ({ onSubmit, isLoading = false }: WordFormNewProps) => {
  const [english, setEnglish] = useState('')
  const [spanish, setSpanish] = useState('')
  const [priority, setPriority] = useState<Priority>('always')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = english.trim()
    if (trimmed.length < 2) return
    debounceRef.current = setTimeout(async () => {
      setIsTranslating(true)
      const translation = await dictionaryApi.searchWord(trimmed)
      setIsTranslating(false)
      if (translation) setSpanish(translation)
    }, 600)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [english])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!english.trim()) { setError('La palabra en inglés es requerida'); return }
    if (!spanish.trim()) { setError('La traducción es requerida'); return }
    if (spanish.trim().includes(' ')) { setError('La traducción debe ser UNA SOLA PALABRA'); return }
    onSubmit(english.trim(), spanish.trim().toLowerCase(), priority)
    const saved = english.trim()
    setEnglish('')
    setSpanish('')
    setPriority('always')
    setSuccessMessage(`"${saved}" agregada`)
    setTimeout(() => setSuccessMessage(''), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Inglés */}
      <div>
        <label className="block text-sm font-semibold text-white/60 mb-2 tracking-wide uppercase">
          Palabra en inglés
        </label>
        <input
          type="text"
          value={english}
          onChange={e => { setEnglish(e.target.value); setError('') }}
          placeholder="Ej: beautiful, amazing..."
          autoFocus
          className="w-full px-5 py-4 border-2 border-white/20 bg-white/10 rounded-2xl focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all text-white placeholder-white/25 text-lg font-medium"
          disabled={isLoading}
        />
      </div>

      {/* Traducción */}
      <div>
        <label className="block text-sm font-semibold text-white/60 mb-2 tracking-wide uppercase flex items-center gap-2">
          Traducción al español
          {isTranslating && (
            <span className="text-blue-400 font-normal text-xs flex items-center gap-1 normal-case tracking-normal">
              <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block" />
              buscando...
            </span>
          )}
        </label>
        <input
          type="text"
          value={spanish}
          onChange={e => { setSpanish(e.target.value); setError('') }}
          placeholder="Se completa automáticamente..."
          className="w-full px-5 py-4 border-2 border-white/20 bg-white/10 rounded-2xl focus:border-blue-400 focus:bg-white/15 focus:outline-none transition-all text-white placeholder-white/25 text-lg font-medium"
          disabled={isLoading || isTranslating}
        />
        {spanish && !spanish.trim().includes(' ') && !isTranslating && (
          <p className="text-green-400 text-xs mt-1.5 ml-1 flex items-center gap-1">
            <span>✓</span> Listo
          </p>
        )}
      </div>

      {/* Frecuencia */}
      <div>
        <label className="block text-sm font-semibold text-white/60 mb-3 tracking-wide uppercase">
          Frecuencia de aparición
        </label>
        <div className="grid grid-cols-3 gap-3">
          {([
            { value: 'normal',   label: 'Normal',   sub: '1×', activeClass: 'from-gray-500 to-gray-600' },
            { value: 'frequent', label: 'Frecuente', sub: '3×', activeClass: 'from-blue-500 to-blue-600' },
            { value: 'always',   label: 'Siempre',  sub: '5×', activeClass: 'from-purple-500 to-violet-600' },
          ] as const).map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                priority === p.value
                  ? `bg-gradient-to-b ${p.activeClass} text-white border-transparent shadow-lg scale-105`
                  : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              <div className="text-base">{p.label}</div>
              <div className={`text-xs mt-0.5 ${priority === p.value ? 'text-white/70' : 'text-white/30'}`}>{p.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="px-4 py-3 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 text-sm font-medium">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="px-4 py-3 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300 text-sm font-medium flex items-center gap-2">
          ✅ {successMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || isTranslating || !english.trim() || !spanish.trim()}
        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all active:scale-95 text-lg shadow-lg shadow-blue-900/40"
      >
        {isLoading ? '⏳ Guardando...' : 'Agregar Palabra'}
      </button>
    </form>
  )
}
