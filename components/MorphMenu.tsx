'use client'

import type { ReactNode } from 'react'
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { X } from 'lucide-react'

export default function MorphMenu({
  label,
  title,
  icon,
  children,
  className = '',
}: {
  label: string
  title: string
  icon: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Menu
      as="div"
      className={({ open }) => `relative isolate z-50 ${open ? 'drop-shadow-lg' : ''} ${className}`}
    >
      {({ open }) => (
        <>
          <MenuButton
            aria-label={label}
            className={`relative z-10 flex h-13 w-13 items-center justify-center rounded-full text-gray-600 transition-colors duration-300 ease-out focus-visible:outline-offset-4 dark:text-gray-300 ${open ? 'bg-white dark:bg-gray-900' : 'bg-gray-100/80 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800'}`}
          >
            <span
              aria-hidden="true"
              className={`absolute transition duration-200 ${open ? 'scale-75 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
            >
              {icon}
            </span>
            <X
              aria-hidden="true"
              className={`h-5 w-5 transition duration-200 ${open ? 'scale-100 rotate-0 opacity-100' : 'scale-75 rotate-90 opacity-0'}`}
            />
          </MenuButton>
          <MenuItems
            transition
            modal={false}
            className="morph-menu-panel absolute top-0 right-0 w-56 origin-top-right rounded-3xl border border-gray-200 bg-white p-2 pt-14 text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            <span
              aria-hidden="true"
              className="morph-menu-content absolute top-0 left-4 flex h-13 items-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {title}
            </span>
            <div className="morph-menu-content space-y-1">{children}</div>
          </MenuItems>
        </>
      )}
    </Menu>
  )
}
