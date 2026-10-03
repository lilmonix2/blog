'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'
import { Check, Menu } from 'lucide-react'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <>
      <button
        type="button"
        aria-label="打开导航菜单"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 sm:hidden dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-70">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <DialogPanel className="fixed inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-6 dark:bg-gray-950">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">网站导航</DialogTitle>
            <button
              type="button"
              aria-label="关闭导航菜单"
              className="min-h-11 rounded-md px-3"
              onClick={() => setOpen(false)}
            >
              关闭
            </button>
          </div>
          <nav id="mobile-navigation" aria-label="手机导航" className="mt-8 space-y-3">
            {headerNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={
                  pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(`${link.href}/`))
                    ? 'page'
                    : undefined
                }
                onClick={() => setOpen(false)}
                className="aria-[current=page]:bg-primary-50 aria-[current=page]:text-primary-700 dark:aria-[current=page]:bg-primary-950 dark:aria-[current=page]:text-primary-200 flex min-h-11 items-center justify-between rounded-lg px-3 py-3 text-lg font-medium transition-colors hover:bg-gray-100 aria-[current=page]:font-semibold dark:hover:bg-gray-800"
              >
                {link.title}
                {(pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(`${link.href}/`))) && (
                  <Check className="h-5 w-5" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>
        </DialogPanel>
      </Dialog>
    </>
  )
}
