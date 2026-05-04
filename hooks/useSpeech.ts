'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const unlockedRef = useRef(false)

  // iOS Safari PWA requires speechSynthesis to be triggered from a direct
  // user gesture. We unlock it on the very first touch so later calls work.
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const unlock = () => {
      if (unlockedRef.current) return
      unlockedRef.current = true
      const utterance = new SpeechSynthesisUtterance('')
      utterance.volume = 0
      window.speechSynthesis.speak(utterance)
    }

    window.addEventListener('touchstart', unlock, { once: true })
    window.addEventListener('click', unlock, { once: true })
    return () => {
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('click', unlock)
    }
  }, [])

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const synth = window.speechSynthesis
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

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  }
}
