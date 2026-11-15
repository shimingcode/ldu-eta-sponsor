/** Public assets resolve under the Vite/GitHub Pages subpath. */
export function assetUrl(path?: string): string | undefined {
  if (!path?.trim()) return undefined
  const value = path.trim()
  if (/^https:\/\//i.test(value)) return value
  let decoded: string
  try {
    decoded = decodeURIComponent(value)
  } catch {
    return undefined
  }
  const hasControlCharacters = [...decoded].some(
    (character) => character.charCodeAt(0) < 32,
  )
  if (
    /^[a-z][a-z\d+.-]*:/i.test(decoded) ||
    decoded.startsWith('//') ||
    decoded.includes('\\') ||
    hasControlCharacters ||
    decoded.split('/').includes('..')
  )
    return undefined
  return `${import.meta.env.BASE_URL}${value.replace(/^\/+/, '')}`
}
export function safeContactUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url)
    return ['https:', 'mailto:', 'tel:'].includes(parsed.protocol)
      ? url
      : undefined
  } catch {
    return undefined
  }
}
