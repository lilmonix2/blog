import NextImage, { ImageProps } from 'next/image'
import { assetPath, isGifImage } from '@/lib/assets'

const Image = ({ src, unoptimized, ...rest }: ImageProps) => (
  <NextImage src={assetPath(src)} {...rest} unoptimized={isGifImage(src) || unoptimized} />
)

export default Image
