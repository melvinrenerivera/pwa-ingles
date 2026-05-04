// Singleton AudioContext — unlocked once on first user gesture, then plays freely on iOS PWA
let ctx: AudioContext | null = null

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
    || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  return ctx
}

export const unlockAudioContext = () => {
  const ac = getCtx()
  if (ac && ac.state === 'suspended') ac.resume()
}

export const playAudioBuffer = (buffer: AudioBuffer) => {
  const ac = getCtx()
  if (!ac) return
  const source = ac.createBufferSource()
  source.buffer = buffer
  source.connect(ac.destination)
  source.start(0)
}

export const fetchAndDecodeAudio = async (url: string): Promise<AudioBuffer | null> => {
  const ac = getCtx()
  if (!ac) return null
  try {
    const res = await fetch(url)
    const arrayBuffer = await res.arrayBuffer()
    return await ac.decodeAudioData(arrayBuffer)
  } catch {
    return null
  }
}

export const fetchDictionaryAudioUrl = async (word: string, signal?: AbortSignal): Promise<string | null> => {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      { signal }
    )
    const data = await res.json()
    const phonetics = data?.[0]?.phonetics ?? []
    const audio = phonetics.find((p: { audio?: string }) => p.audio)?.audio
    return audio || null
  } catch {
    return null
  }
}
