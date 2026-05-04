'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { WordCardNew } from '@/components/WordCardNew'
import type { Word, Priority } from '@/types'

const DEGRADE: Record<Priority, Priority> = {
  always: 'frequent',
  frequent: 'normal',
  normal: 'normal',
}

export default function StudyPage() {
  const router = useRouter()
  const store = useStore()
  const [studyWords, setStudyWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    store.loadWords()
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const shuffled = store.getShuffledWords()
      setStudyWords(shuffled)
      if (shuffled.length === 0) {
        const t = setTimeout(() => router.push('/'), 2000)
        return () => clearTimeout(t)
      }
    }
  }, [isLoaded])

  const handleNext = () => {
    if (currentIndex < studyWords.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      handleEndSession()
    }
  }

  // Swipe Up → mantener frecuencia, el componente gestiona el flip + timer
  const handleSwipeUp = () => {
    localStorage.setItem('lastStudied', Date.now().toString())
  }

  // Swipe Right → degradar una frecuencia + avanzar
  const handleSwipeRight = () => {
    if (currentIndex < studyWords.length) {
      const word = studyWords[currentIndex]
      const newPriority = DEGRADE[word.priority]
      store.updateWord(word.id, { priority: newPriority })
      localStorage.setItem('lastStudied', Date.now().toString())
    }
    handleNext()
  }

  const handleEndSession = () => {
    localStorage.setItem('lastStudied', Date.now().toString())
    router.push('/')
  }

  if (!isLoaded || studyWords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            {store.words.length === 0 ? 'No tienes palabras aún' : 'Preparando sesión...'}
          </h1>
          <p className="text-blue-300 text-sm mb-8">
            {store.words.length === 0 ? '¡Agrega algunas palabras primero!' : ''}
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <WordCardNew
      key={currentIndex}
      word={studyWords[currentIndex]}
      onSwipeUp={handleSwipeUp}
      onSwipeRight={handleSwipeRight}
      onNext={handleNext}
      onExit={handleEndSession}
      index={currentIndex}
      total={studyWords.length}
    />
  )
}
