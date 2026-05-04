'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { Word } from '@/types'
import { useSpeech } from '@/hooks/useSpeech'

interface WordCardNewProps {
  word: Word
  onSwipeUp: () => void      // Mantener frecuencia — muestra significado 3s
  onSwipeRight: () => void   // Degradar frecuencia + avanzar
  onNext: () => void         // Avanzar (llamado por el componente después de 3s)
  onExit?: () => void
  index?: number
  total?: number
}

type CardState = 'idle' | 'flipping' | 'showing' | 'sliding-right' | 'advancing'

const PRIORITY_LABEL: Record<string, string> = { normal: 'Normal', frequent: 'Frecuente', always: 'Siempre' }
const PRIORITY_COLOR: Record<string, string>  = { normal: 'text-gray-400', frequent: 'text-blue-400', always: 'text-purple-400' }

export const WordCardNew = ({
  word,
  onSwipeUp,
  onSwipeRight,
  onNext,
  onExit,
  index = 0,
  total = 0,
}: WordCardNewProps) => {
  const { speak } = useSpeech()
  const [state, setState] = useState<CardState>('idle')
  const [isFlipped, setIsFlipped] = useState(false)
  const flipTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const advTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStart    = useRef<{ x: number; y: number } | null>(null)
  const mouseStart    = useRef<{ x: number; y: number } | null>(null)
  const isDragging    = useRef(false)
  const audioUrlRef   = useRef<string | null>(null)

  // Fetch MP3 and play immediately when card appears
  useEffect(() => {
    audioUrlRef.current = null
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.english)}`)
      .then(r => r.json())
      .then(data => {
        const phonetics = data?.[0]?.phonetics ?? []
        const audio = phonetics.find((p: { audio?: string }) => p.audio)?.audio
        if (audio) {
          audioUrlRef.current = audio
          new Audio(audio).play().catch(() => speak(word.english, 'en-US'))
        } else {
          speak(word.english, 'en-US')
        }
      })
      .catch(() => speak(word.english, 'en-US'))
  }, [word.english, speak])

  useEffect(() => () => {
    if (flipTimerRef.current)  clearTimeout(flipTimerRef.current)
    if (advTimerRef.current)   clearTimeout(advTimerRef.current)
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current)
  }, [])

  // ── Swipe Up: mantener frecuencia, ver significado 3s ──
  const triggerSwipeUp = useCallback(() => {
    if (state !== 'idle') return
    onSwipeUp()
    setState('flipping')
    setIsFlipped(true)
    flipTimerRef.current = setTimeout(() => setState('showing'), 600)
    advTimerRef.current  = setTimeout(() => { setState('advancing'); onNext() }, 3600)
  }, [state, onSwipeUp, onNext])

  // ── Swipe Right: degradar frecuencia, salir ──
  const triggerSwipeRight = useCallback(() => {
    if (state !== 'idle') return
    setState('sliding-right')
    slideTimerRef.current = setTimeout(() => onSwipeRight(), 350)
  }, [state, onSwipeRight])

  // ── Doble tap en traducción para saltar ──
  const handleSkip = useCallback(() => {
    if (state !== 'showing' && state !== 'flipping') return
    if (flipTimerRef.current)  clearTimeout(flipTimerRef.current)
    if (advTimerRef.current)   clearTimeout(advTimerRef.current)
    setState('advancing')
    onNext()
  }, [state, onNext])

  // ── Teclado ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp')    triggerSwipeUp()
      if (e.key === 'ArrowRight') triggerSwipeRight()
      if (e.key === 'Enter' || e.key === ' ') handleSkip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [triggerSwipeUp, triggerSwipeRight, handleSkip])

  // ── Touch ──
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    const swipeUp = Math.abs(dy) > 40 && dy < 0 && Math.abs(dy) > Math.abs(dx)
    if (state === 'showing' && swipeUp) { handleSkip(); return }
    if (state !== 'idle') return
    if (swipeUp) triggerSwipeUp()
    else if (Math.abs(dx) > 40 && dx > 0 && Math.abs(dx) > Math.abs(dy)) triggerSwipeRight()
  }

  // ── Mouse drag (desktop) ──
  const onMouseDown = (e: React.MouseEvent) => {
    mouseStart.current = { x: e.clientX, y: e.clientY }
    isDragging.current = false
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseStart.current) return
    if (Math.abs(e.clientX - mouseStart.current.x) > 5 || Math.abs(e.clientY - mouseStart.current.y) > 5) {
      isDragging.current = true
    }
  }
  const onMouseUp = (e: React.MouseEvent) => {
    if (!mouseStart.current || !isDragging.current) { mouseStart.current = null; return }
    const dx = e.clientX - mouseStart.current.x
    const dy = e.clientY - mouseStart.current.y
    mouseStart.current = null; isDragging.current = false
    const swipeUp = Math.abs(dy) > 30 && dy < 0 && Math.abs(dy) > Math.abs(dx)
    if (state === 'showing' && swipeUp) { handleSkip(); return }
    if (state !== 'idle') return
    if (swipeUp) triggerSwipeUp()
    else if (Math.abs(dx) > 30 && dx > 0 && Math.abs(dx) > Math.abs(dy)) triggerSwipeRight()
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex flex-col items-center justify-center p-4 select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Header */}
      <div className="absolute top-6 left-4 right-4 flex justify-between items-center">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold border border-white/10"
        >
          ✕ Salir
        </button>
        <div className="text-right">
          {total > 0 && (
            <div className="text-base font-bold text-white/70">{index + 1} / {total}</div>
          )}
          <div className={`text-xs font-medium ${PRIORITY_COLOR[word.priority]}`}>
            {PRIORITY_LABEL[word.priority]}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Tarjeta 3D */}
        <div className="relative h-64" style={{ perspective: '1000px' }}>
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: state === 'sliding-right'
                ? 'translateX(130%) rotate(12deg)'
                : isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: state === 'sliding-right'
                ? 'transform 350ms ease-in, opacity 350ms'
                : 'transform 600ms cubic-bezier(0.4, 0.2, 0.2, 1)',
              opacity: state === 'sliding-right' ? 0 : 1,
            }}
          >
            {/* Frente */}
            <div
              className="absolute w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <h1 className="text-6xl font-bold text-gray-800 text-center break-words leading-tight">
                {word.english}
              </h1>
            </div>

            {/* Atrás — doble tap para saltar */}
            <div
              className="absolute w-full h-full bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 cursor-pointer"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              onDoubleClick={handleSkip}
            >
              <p className={`text-5xl font-bold text-white text-center ${state === 'showing' ? 'animate-fadeInTranslation' : ''}`}>
                {word.spanish}
              </p>
              <p className="text-white/40 text-xs mt-4">doble tap para saltar</p>
            </div>
          </div>
        </div>

        {/* Instrucciones — solo en idle */}
        {state === 'idle' && (
          <div className="flex items-center justify-between px-4 animate-fadeIn">
            {/* Swipe right */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white/50 text-lg">→</span>
              </div>
              <span className="text-white/35 text-xs leading-tight">Ya lo sé<br/>baja frecuencia</span>
            </div>

            {/* Swipe up */}
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white/70 text-lg">↑</span>
              </div>
              <span className="text-white/50 text-xs leading-tight">Ver significado<br/>misma frecuencia</span>
            </div>
          </div>
        )}

        {/* Hint cuando muestra traducción */}
        {state === 'showing' && (
          <div className="flex justify-center animate-fadeIn">
            <div className="bg-white/10 rounded-full px-5 py-2 text-white/50 text-xs border border-white/10">
              Siguiente en 3s · doble tap para saltar
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInTranslation {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTranslation { animation: fadeInTranslation 300ms ease-out forwards; }
        .animate-fadeIn            { animation: fadeIn 300ms ease-out forwards; }
      `}</style>
    </div>
  )
}
