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
    const words = [...get().getFilteredWords(priority)]
    // Fisher-Yates shuffle — each word appears exactly once per session
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]]
    }
    return words
  },
}))
