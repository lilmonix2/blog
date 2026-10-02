'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

const options = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
]

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  useEffect(() => setMounted(true), [])

  const CurrentIcon = !mounted ? Monitor : resolvedTheme === 'dark' ? Moon : Sun

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        aria-label="切换主题"
      >
        <CurrentIcon className="h-5 w-5" aria-hidden="true" />
      </MenuButton>
      <MenuItems className="absolute right-0 z-50 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = mounted && theme === option.value
          return (
            <MenuItem key={option.value}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => setTheme(option.value)}
                className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors ${
                  isSelected
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{option.label}</span>
                {isSelected && <Check className="ml-auto h-4 w-4" aria-hidden="true" />}
              </button>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}
