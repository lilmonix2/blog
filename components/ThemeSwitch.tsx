'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { MenuItem } from '@headlessui/react'
import MorphMenu from './MorphMenu'
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
    <MorphMenu label="切换主题" title="外观" icon={<CurrentIcon className="h-5 w-5" />}>
      {options.map((option) => {
        const Icon = option.icon
        const isSelected = mounted && theme === option.value
        return (
          <MenuItem key={option.value}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => setTheme(option.value)}
              className={`morph-menu-item ${
                isSelected
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{option.label}</span>
              {isSelected && <Check className="ml-auto h-4 w-4" aria-hidden="true" />}
            </button>
          </MenuItem>
        )
      })}
    </MorphMenu>
  )
}
