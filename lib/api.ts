export const dictionaryApi = {
  searchWord: async (word: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word.trim())}&langpair=en|es`
      )
      const data = await res.json()
      const translated: string = data?.responseData?.translatedText ?? ''
      if (translated && data?.responseStatus === 200) {
        const single = translated.split(/[\s,;()]+/)[0].toLowerCase()
        if (single.length >= 2) return single
      }
      return null
    } catch {
      return null
    }
  },
}
