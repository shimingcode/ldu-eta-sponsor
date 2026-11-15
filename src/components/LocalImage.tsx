import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { assetUrl } from '../data/assets'
export function LocalImage({
  path,
  alt,
  className = '',
  eager = false,
}: {
  path?: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [failedPath, setFailedPath] = useState<string>()
  const src = assetUrl(path)
  if (!src || failedPath === src)
    return (
      <div
        className={`image-fallback ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff aria-hidden="true" size={32} />
        <span>图片待补充</span>
      </div>
    )
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedPath(src)}
    />
  )
}
