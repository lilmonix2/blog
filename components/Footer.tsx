import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer className="mt-16">
      <section
        aria-labelledby="friend-links-heading"
        className="border-t border-gray-200 pt-6 dark:border-gray-800"
      >
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            id="friend-links-heading"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            友情链接
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">本人严选的 IP 查询工具</span>
        </div>
        <a href="https://ipkk.com/" className="group block w-fit max-w-full rounded-2xl">
          {/* Load directly from IPKK so the card reflects the visitor's connection IP. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ipkk.com/card/image/26MO"
            alt="IP 信息卡片"
            width={480}
            height={464}
            loading="lazy"
            decoding="async"
            className="h-auto max-w-full dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ipkk.com/card/image/27BO"
            alt="IP 信息卡片"
            width={480}
            height={464}
            loading="lazy"
            decoding="async"
            className="hidden h-auto max-w-full dark:block"
          />
          <span className="text-primary-600 dark:text-primary-300 mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 group-hover:underline group-focus-visible:underline">
            查看你的网络信息 · IPKK
            <span aria-hidden="true">↗</span>
          </span>
        </a>
      </section>
      <div className="mt-8 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
        </div>
        <div className="mb-10 flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{siteMetadata.title}</Link>
          <div>{` • `}</div>
          <Link href="https://beian.miit.gov.cn/">京ICP备2023017120号</Link>
        </div>
      </div>
    </footer>
  )
}
