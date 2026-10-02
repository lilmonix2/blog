'use client'

import NextImage, { getImageProps, type ImageProps } from 'next/image'
import { PhotoView } from 'react-photo-view'
import { assetPath, imageUrl } from '@/lib/assets'

export default function ZoomImage({ src, alt, ...rest }: ImageProps) {
  const original = imageUrl(src)
  const fullSize = getImageProps({
    src: original,
    alt,
    width: Number(rest.width) || 1920,
    height: Number(rest.height) || 1080,
    quality: 100,
  }).props.src
  return (
    <PhotoView
      src={fullSize}
      overlay={
        <span className="absolute right-4 bottom-4 left-4 text-center text-sm text-white">
          {alt}
        </span>
      }
    >
      <button
        type="button"
        className="block w-full cursor-zoom-in rounded-sm"
        aria-label={`查看大图：${alt || '文章配图'}`}
      >
        <NextImage
          src={assetPath(src)}
          alt={alt}
          sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1280px) calc(100vw - 96px), 768px"
          {...rest}
        />
      </button>
    </PhotoView>
  )
}
