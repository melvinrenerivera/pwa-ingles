'use client'

import { useState } from 'react'
import { useSpeech } from '@/hooks/useSpeech'
import type { Word } from '@/types'

interface WordCardProps {
  word: Word
  onNext?: () => void
  onPrevious?: () => void
  index?: number
  total?: number
}

export const WordCard = ({
  word,
  onNext,
  onPrevious,
  index = 0,
  total = 0,
}: WordCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const { speak, isSpeaking, isSupported } = useSpeech()

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation()
    speak(word.english)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {total > 0 && (
        <div className="absolute top-8 right-8 text-lg font-semibold text-gray-600">
          {index + 1} / {total}
        </div>
      )}

      <div
        className="relative w-full max-w-2xl h-96 cursor-pointer perspective"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full transition-transform duration-500 relative transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className={`absolute w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 ${
              isFlipped ? 'hidden' : ''
            }`}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-6xl font-bold text-gray-800 mb-8 text-center">
              {word.english}
            </div>

            {isSupported && (
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full text-lg font-semibold transition-colors flex items-center gap-2"
              >
                <span>🔊</span>
                {isSpeaking ? 'Pronunciando...' : 'Pronunciar'}
              </button>
            )}

            <div className="mt-12 text-gray-400 text-lg">
              Click para ver traducción
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute w-full h-full bg-purple-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 ${
              !isFlipped ? 'hidden' : ''
            }`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="text-gray-200 text-lg mb-4">Significado</div>
            <div className="text-5xl font-bold text-white text-center">
              {word.spanish}
            </div>
            <div className="mt-12 text-purple-100">
              Click para ver palabra
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-12">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}
