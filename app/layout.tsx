import 'css/tailwind.css'
import 'remark-github-blockquote-alert/alert.css'

import { Analytics } from 'pliny/analytics'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata, Viewport } from 'next'
import { siteUrl } from './seo'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteUrl('/'),
    siteName: siteMetadata.title,
    images: [siteUrl(siteMetadata.socialBanner)],
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: {
    canonical: siteUrl('/'),
    types: {
      'application/rss+xml': siteUrl('/feed.xml'),
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteUrl(siteMetadata.socialBanner)],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  return (
    <html lang={siteMetadata.language} className={`scroll-smooth`} suppressHydrationWarning>
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <meta name="msapplication-TileColor" content="#000000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:rounded focus:bg-white focus:p-3 focus:text-blue-700"
        >
          跳到正文
        </a>
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics} />
          <SectionContainer>
            <Header />
            <main id="main-content" tabIndex={-1} className="mb-auto">
              {children}
            </main>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
