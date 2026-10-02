import NextImage, { ImageProps } from 'next/image'
import { assetPath } from '@/lib/assets'

const Image = ({ src, ...rest }: ImageProps) => <NextImage src={assetPath(src)} {...rest} />

export default Image
