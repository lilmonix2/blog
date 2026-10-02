import type { AnalyticsConfig } from 'pliny/analytics'

export interface SiteConfig {
  title: string
  author: string
  headerTitle: string
  description: string
  language: string
  theme: 'light' | 'dark' | 'system'
  siteUrl: string
  siteRepo: string
  siteLogo: string
  socialBanner: string
  email: string
  github: string
  twitter: string
  locale: string
  stickyNav: boolean
  analytics: AnalyticsConfig
  comments: {
    provider: 'giscus'
    giscusConfig: {
      repo?: string
      repositoryId?: string
      category?: string
      categoryId?: string
      mapping: 'pathname'
      reactions: '1' | '0'
      metadata: '1' | '0'
      theme: string
      darkTheme: string
      lang: string
    }
  }
}
