'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import type { Word, Priority } from '@/types'

export const useWords = () => {
  const store = useStore()

  useEffect(() => {
    store.loadWords()
  }, [])

  const addWord = (english: string, spanish: string, priority: Priority = 'normal') => {
    const word: Word = {
      id: Date.now().toString(),
      english,
      spanish,
      priority,
      createdAt: Date.now(),
    }
    store.addWord(word)
    return word
  }

  const updatePriority = (id: string, priority: Priority) => {
    store.updateWord(id, { priority })
  }

  const deleteWord = (id: string) => {
    store.deleteWord(id)
  }

  const updateLastStudied = (id: string) => {
    store.updateWord(id, { lastStudied: Date.now() })
  }

  return {
    words: store.words,
    addWord,
    updatePriority,
    deleteWord,
    updateLastStudied,
    getFilteredWords: store.getFilteredWords,
    getShuffledWords: store.getShuffledWords,
  }
}
