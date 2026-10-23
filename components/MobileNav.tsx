'use client'

import { MenuItem } from '@headlessui/react'
import { usePathname } from 'next/navigation'
import { Check, Menu, Home, FileText, Tags, User } from 'lucide-react'
import Link from './Link'
import MorphMenu from './MorphMenu'
import headerNavLinks from '@/data/headerNavLinks'

const icons = { '/': Home, '/blog': FileText, '/tags': Tags, '/about': User }

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <MorphMenu
      label="网站导航"
      title="浏览博客"
      icon={<Menu className="h-5 w-5" />}
      className="sm:hidden"
    >
      {headerNavLinks.map((link) => {
        const active =
          pathname === link.href || (link.href !== '/' && pathname.startsWith(`${link.href}/`))
        const Icon = icons[link.href as keyof typeof icons] || FileText
        return (
          <MenuItem key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`morph-menu-item ${active ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-200' : ''}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{link.title}</span>
              {active && <Check className="ml-auto h-4 w-4" aria-hidden="true" />}
            </Link>
          </MenuItem>
        )
      })}
    </MorphMenu>
  )
}
