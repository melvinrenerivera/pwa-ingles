'use client'

import { create } from 'zustand'
import type { Word, Priority } from '@/types'
import { storageUtils } from './storage'

interface Store {
  words: Word[]
  currentIndex: number
  isStudyMode: boolean
  loadWords: () => void
  addWord: (word: Word) => void
  updateWord: (id: string, updates: Partial<Word>) => void
  deleteWord: (id: string) => void
  setCurrentIndex: (index: number) => void
  setStudyMode: (mode: boolean) => void
  getFilteredWords: (priority?: Priority) => Word[]
  getShuffledWords: (priority?: Priority) => Word[]
}

export const useStore = create<Store>((set, get) => ({
  words: [],
  currentIndex: 0,
  isStudyMode: false,

  loadWords: () => {
    const words = storageUtils.getWords()
    set({ words })
  },

  addWord: (word: Word) => {
    const words = [...get().words]
    const exists = words.some(w => w.english.toLowerCase() === word.english.toLowerCase())
    if (!exists) {
      words.push(word)
      set({ words })
      storageUtils.saveWords(words)
    }
  },

  updateWord: (id: string, updates: Partial<Word>) => {
    const words = get().words.map(w => (w.id === id ? { ...w, ...updates } : w))
    set({ words })
    storageUtils.saveWords(words)
  },

  deleteWord: (id: string) => {
    const words = get().words.filter(w => w.id !== id)
    set({ words })
    storageUtils.saveWords(words)
  },

  setCurrentIndex: (index: number) => {
    set({ currentIndex: index })
  },

  setStudyMode: (mode: boolean) => {
    set({ isStudyMode: mode, currentIndex: 0 })
  },

  getFilteredWords: (priority?: Priority) => {
    const words = get().words
    return priority ? words.filter(w => w.priority === priority) : words
  },

  getShuffledWords: (priority?: Priority) => {
    const words = get().getFilteredWords(priority)
    // Weight words by priority: normal=1x, frequent=3x, always=5x
    const weights: Record<Priority, number> = {
      'normal': 1,
      'frequent': 3,
      'always': 5,
    }
    const weighted: Word[] = []
    words.forEach(word => {
      const count = weights[word.priority]
      for (let i = 0; i < count; i++) {
        weighted.push(word)
      }
    })
    // Fisher-Yates shuffle
    for (let i = weighted.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weighted[i], weighted[j]] = [weighted[j], weighted[i]]
    }
    return weighted
  },
}))
