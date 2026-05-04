'use client'

import { useCallback, useState } from 'react'

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (typeof window === 'undefined') return

    const synth = window.speechSynthesis

    // Cancel any ongoing speech
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synth.speak(utterance)
  }, [])

  const cancel = useCallback(() => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  const isSupportedInBrowser = (): boolean => {
    if (typeof window === 'undefined') return false
    return 'speechSynthesis' in window
  }

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported: isSupportedInBrowser(),
  }
}
