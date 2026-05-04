'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'

export default function Home() {
  const { words, loadWords } = useStore()
  const [lastStudied, setLastStudied] = useState<string>('')

  useEffect(() => {
    loadWords()
    const stored = localStorage.getItem('lastStudied')
    if (stored) {
      const date = new Date(parseInt(stored))
      setLastStudied(date.toLocaleDateString('es-ES', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      }))
    }
  }, [])

  const alwaysCount = words.filter(w => w.priority === 'always').length
  const frequentCount = words.filter(w => w.priority === 'frequent').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 pb-28">
      <div className="max-w-md mx-auto px-4 pt-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-3xl font-bold text-white">Aprende Inglés</h1>
          <p className="text-blue-300 text-sm mt-1">Vocabulario con tarjetas interactivas</p>
          {lastStudied && (
            <p className="text-white/30 text-xs mt-2">Última sesión: {lastStudied}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white/8 rounded-2xl p-4 text-center border border-white/10">
            <p className="text-3xl font-bold text-white">{words.length}</p>
            <p className="text-blue-300/70 text-xs mt-1">Total</p>
          </div>
          <div className="bg-white/8 rounded-2xl p-4 text-center border border-white/10">
            <p className="text-3xl font-bold text-blue-300">{frequentCount}</p>
            <p className="text-blue-300/70 text-xs mt-1">Frecuente</p>
          </div>
          <div className="bg-white/8 rounded-2xl p-4 text-center border border-white/10">
            <p className="text-3xl font-bold text-purple-300">{alwaysCount}</p>
            <p className="text-purple-300/70 text-xs mt-1">Siempre</p>
          </div>
        </div>

        {/* 3 Cards separadas */}
        <div className="space-y-5">

          {/* Card Agregar */}
          <Link
            href="/add-word"
            className="block rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/50 active:scale-[0.97] transition-all duration-200 hover:shadow-blue-700/40 hover:-translate-y-0.5"
          >
            <div className="relative bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 p-7 overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
              <div className="absolute -right-2 top-14 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                  <span className="text-3xl">✍️</span>
                </div>
                <span className="text-white/50 text-xl mt-1">›</span>
              </div>
              <h2 className="text-xl font-bold text-white">Agregar Palabra</h2>
              <p className="text-blue-100/80 text-sm mt-1.5">
                Escribe en inglés · traducción automática
              </p>
            </div>
          </Link>

          {/* Card Estudiar */}
          <Link
            href="/study"
            className={`block rounded-3xl overflow-hidden shadow-2xl active:scale-[0.97] transition-all duration-200 ${
              words.length === 0
                ? 'opacity-40 pointer-events-none shadow-none'
                : 'shadow-emerald-900/50 hover:shadow-emerald-700/40 hover:-translate-y-0.5'
            }`}
          >
            <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-700 p-7 overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
              <div className="absolute -right-2 top-14 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                  <span className="text-3xl">🚀</span>
                </div>
                <span className="text-white/50 text-xl mt-1">›</span>
              </div>
              <h2 className="text-xl font-bold text-white">Estudiar</h2>
              <p className="text-emerald-100/80 text-sm mt-1.5">
                {words.length === 0
                  ? 'Agrega palabras primero'
                  : `${words.length} palabra${words.length !== 1 ? 's' : ''} · tarjetas interactivas`}
              </p>
            </div>
          </Link>

          {/* Card Mis Palabras */}
          <Link
            href="/words"
            className="block rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/50 active:scale-[0.97] transition-all duration-200 hover:shadow-purple-700/40 hover:-translate-y-0.5"
          >
            <div className="relative bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-800 p-7 overflow-hidden">
              <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
              <div className="absolute -right-2 top-14 w-20 h-20 rounded-full bg-white/5" />
              <div className="relative flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                  <span className="text-3xl">📖</span>
                </div>
                <span className="text-white/50 text-xl mt-1">›</span>
              </div>
              <h2 className="text-xl font-bold text-white">Mis Palabras</h2>
              <p className="text-purple-100/80 text-sm mt-1.5">
                Gestiona y ajusta la frecuencia de cada palabra
              </p>
            </div>
          </Link>

        </div>

        {/* Welcome */}
        {words.length === 0 && (
          <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-blue-200 text-sm">
              👋 ¡Empieza agregando tu primera palabra!
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
