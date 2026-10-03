import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-200 dark:hover:bg-primary-900 inline-flex min-h-11 items-center rounded-full px-2.5 text-xs font-medium transition-colors sm:min-h-8"
    >
      {text}
    </Link>
  )
}

export default Tag
