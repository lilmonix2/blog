import type { ImageProps } from 'next/image'

// Expose the same build-time prefix to server and browser bundles.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function assetPath(src: ImageProps['src']): ImageProps['src'] {
  if (typeof src !== 'string' || !src.startsWith('/') || src.startsWith('//')) return src
  if (!basePath || src === basePath || src.startsWith(`${basePath}/`)) return src
  return `${basePath}${src}`
}

export function imageUrl(src: ImageProps['src']): string {
  const resolved = assetPath(src)
  return typeof resolved === 'string'
    ? resolved
    : 'src' in resolved
      ? resolved.src
      : resolved.default.src
}
