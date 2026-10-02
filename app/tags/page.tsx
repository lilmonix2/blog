import Link from '@/components/Link'
import { getTags } from '@/lib/content'
import { genPageMetadata } from 'app/seo'
import { Tag as TagIcon } from 'lucide-react'

export const metadata = genPageMetadata({ title: '标签分类', path: '/tags' })

export default function Page() {
  const tags = getTags()
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      <div className="space-y-2 pt-6 pb-8 md:space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">
          标签分类
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400">
          共收录 {tags.length} 个主题标签，点击标签快速筛选相关文章。
        </p>
      </div>
      <div className="py-10">
        <ul className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/tags/${tag.slug}`}
                className="group hover:border-primary-500/50 hover:bg-primary-50/40 hover:text-primary-600 dark:hover:border-primary-400/50 dark:hover:bg-primary-950/40 dark:hover:text-primary-400 inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-2xs transition-all hover:shadow-xs active:scale-95 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300"
              >
                <TagIcon className="group-hover:text-primary-500 dark:group-hover:text-primary-400 h-3.5 w-3.5 text-gray-400 transition-colors" />
                <span>{tag.name}</span>
                <span className="group-hover:bg-primary-100 group-hover:text-primary-700 dark:group-hover:bg-primary-900/80 dark:group-hover:text-primary-200 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 transition-colors dark:bg-gray-800 dark:text-gray-400">
                  {tag.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {!tags.length && <p className="text-gray-500 dark:text-gray-400">暂无标签。</p>}
      </div>
    </div>
  )
}
