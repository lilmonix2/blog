// @ts-check
/** @satisfies {import('../lib/site-config').SiteConfig} */
const siteMetadata = {
  title: "lilmonix2's Blog",
  author: 'lilmonix2',
  headerTitle: "lilmonix2's Blog",
  description: '我在这个网站记录我的成长，努力成为一个更好的程序员。',
  language: 'zh-CN',
  theme: 'system',
  siteUrl: 'https://ixjs.com',
  siteRepo: 'https://github.com/lilmonix2/ixjs_blog',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/social-banner.png',
  email: 'xiewenjineagle@gmail.com',
  github: 'https://github.com/lilmonix2',
  twitter: 'https://twitter.com/frost_on_lemon',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: process.env.NEXT_PUBLIC_UMAMI_ID || process.env.NEXT_UMAMI_ID || '',
    },
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
      repositoryId: process.env.NEXT_PUBLIC_GISCUS_REPOSITORY_ID,
      category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
      categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      lang: 'zh-CN',
    },
  },
}
module.exports = siteMetadata
