'use client'

import { usePathname } from 'next/navigation'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import SelectionIndicator from './SelectionIndicator'

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="主导航"
      className="relative isolate hidden h-13 items-center gap-1 rounded-full bg-gray-100/80 p-1 sm:flex dark:bg-gray-900"
    >
      <SelectionIndicator activeKey={pathname} />
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium transition-colors ${
                active
                  ? 'text-primary-700 dark:text-primary-200'
                  : 'text-gray-600 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {link.title}
            </Link>
          )
        })}
    </nav>
  )
}
