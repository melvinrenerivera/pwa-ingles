'use client'

import { useEffect } from 'react'
import { unlockAudioContext } from '@/lib/audioPlayer'

export const AudioUnlock = () => {
  useEffect(() => {
    const unlock = () => unlockAudioContext()
    window.addEventListener('touchstart', unlock, { once: true })
    window.addEventListener('mousedown', unlock, { once: true })
    return () => {
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('mousedown', unlock)
    }
  }, [])
  return null
}
