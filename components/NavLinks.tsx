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
              className={`rounded-md px-3 py-2 font-medium transition-colors ${
                active
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 dark:text-gray-300'
              }`}
            >
              {link.title}
            </Link>
          )
        })}
    </nav>
  )
}
