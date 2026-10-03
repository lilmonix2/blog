'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <nav aria-label="主导航" className="hidden items-center gap-1 sm:flex">
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-lg border-b-2 px-3 font-medium transition-colors ${
                active
                  ? 'border-primary-600 bg-primary-50 text-primary-700 dark:border-primary-300 dark:bg-primary-950 dark:text-primary-200'
                  : 'hover:text-primary-600 dark:hover:text-primary-300 border-transparent text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
              }`}
            >
              {link.title}
            </Link>
          )
        })}
    </nav>
  )
}
