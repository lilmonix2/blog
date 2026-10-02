import type { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { assetPath } from '@/lib/assets'

type PageSEOProps = Omit<Metadata, 'title' | 'description'> & {
  title: string
  description?: string
  image?: string
  path?: string
}

export function siteUrl(path: string): string {
  return new URL(String(assetPath(path)), `${siteMetadata.siteUrl}/`).toString()
}

export function genPageMetadata({
  title,
  description = siteMetadata.description,
  image = siteMetadata.socialBanner,
  path = '/',
  ...rest
}: PageSEOProps): Metadata {
  const url = siteUrl(path)
  const images = [siteUrl(image)]
  return {
    title,
    description,
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': siteUrl(
          path.startsWith('/tags/') ? `${path.split('/page/')[0]}/feed.xml` : '/feed.xml'
        ),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteMetadata.title,
      images,
      locale: 'zh_CN',
      type: 'website',
    },
    twitter: { title, description, card: 'summary_large_image', images },
    ...rest,
  }
}
