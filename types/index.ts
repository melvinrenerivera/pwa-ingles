export type Priority = 'normal' | 'frequent' | 'always'

export interface Word {
  id: string
  english: string
  spanish: string
  priority: Priority
  createdAt: number
  lastStudied?: number
}

export interface DictionaryResponse {
  word: string
  phonetic?: string
  phonetics?: Array<{
    text?: string
    audio?: string
  }>
  meanings?: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
    }>
  }>
}

export interface AppState {
  words: Word[]
  currentIndex: number
  isStudyMode: boolean
}
