import type { Word } from '@/types'

const WORDS_KEY = 'pwa-ingles-words'
const LAST_SYNC_KEY = 'pwa-ingles-last-sync'

export const storageUtils = {
  getWords: (): Word[] => {
    if (typeof window === 'undefined') return []
    try {
      const data = localStorage.getItem(WORDS_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveWords: (words: Word[]): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(WORDS_KEY, JSON.stringify(words))
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString())
    } catch {
      console.error('Failed to save words to localStorage')
    }
  },

  addWord: (word: Word): void => {
    const words = storageUtils.getWords()
    const exists = words.some(w => w.english.toLowerCase() === word.english.toLowerCase())
    if (!exists) {
      words.push(word)
      storageUtils.saveWords(words)
    }
  },

  updateWord: (id: string, updates: Partial<Word>): void => {
    const words = storageUtils.getWords()
    const index = words.findIndex(w => w.id === id)
    if (index !== -1) {
      words[index] = { ...words[index], ...updates }
      storageUtils.saveWords(words)
    }
  },

  deleteWord: (id: string): void => {
    const words = storageUtils.getWords().filter(w => w.id !== id)
    storageUtils.saveWords(words)
  },

  getLastSync: (): Date | null => {
    if (typeof window === 'undefined') return null
    const lastSync = localStorage.getItem(LAST_SYNC_KEY)
    return lastSync ? new Date(lastSync) : null
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(WORDS_KEY)
    localStorage.removeItem(LAST_SYNC_KEY)
  },
}
