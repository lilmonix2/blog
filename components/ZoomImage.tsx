'use client'

import NextImage, { ImageProps } from 'next/image'
import { PhotoView } from 'react-photo-view'

const basePath = process.env.BASE_PATH

const ZoomImage = ({ src, ...rest }: ImageProps) => {
  const imageSrc = `${basePath || ''}${src}`

  return (
    <PhotoView src={imageSrc}>
      <NextImage
        src={imageSrc}
        {...rest}
        style={{ cursor: 'pointer', ...((rest.style as object) || {}) }}
      />
    </PhotoView>
  )
}

export default ZoomImage
