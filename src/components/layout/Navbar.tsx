'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/app/providers'
import { SunIcon, MoonIcon, BellIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useStore } from '@/store/useStore'
import { useState, useRef, useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Employees', href: '/employees' },
  { name: 'Projects & Goals', href: '/projects' },
  { name: 'Bookmarks', href: '/bookmarks' },
  { name: 'Analytics', href: '/analytics' },
]

export function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              HR Dashboard
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/employees"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/employees'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Employees
              </Link>
              <Link
                href="/leave-management"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/leave-management'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Leave Management
              </Link>
              <Link
                href="/analytics"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/analytics'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Analytics
              </Link>
              <Link
                href="/bookmarks"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/bookmarks'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                Bookmarks
                </Link>
                <Link
                href="/projects"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === '/projects'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                Projects
                </Link>
            </div>
          </div>
          <div className="flex items-center">
            <NotificationBell />
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="mr-4"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NotificationBell() {
  const { notifications, markNotificationAsRead, clearNotifications, removeNotification } = useStore()
  const [open, setOpen] = useState(false)
  const bellRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        bellRef.current && !bellRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
    } else {
      document.removeEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative mr-4">
      <button
        ref={bellRef}
        className="relative focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6 text-gray-500 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          key={notifications.length}
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
            <button
              className="text-xs text-blue-600 hover:underline"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearNotifications();
                setOpen(true);
              }}
            >
              Clear All
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 dark:text-gray-300 text-sm text-center">No notifications</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start justify-between ${n.read ? 'opacity-60' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {n.employeeName}
                      </span>
                      <div className="flex items-center gap-2">
                        {n.type && (
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            n.type === 'project' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                            n.type === 'goal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            n.type === 'promotion' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                          }`}>
                            {n.type}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{new Date(n.date).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                      {n.type === 'project' || n.type === 'goal' ? (
                        <span>{n.reason}</span>
                      ) : (
                        <>
                          Status changed: <span className="font-semibold">{n.oldStatus}</span> → <span className="font-semibold">{n.newStatus}</span>
                        </>
                      )}
                    </div>
                    {n.reason && (
                      <div className="text-xs text-gray-500 mt-1">Reason: {n.reason}</div>
                    )}
                    {!n.read && (
                      <button
                        className="inline-block mt-1 text-xs text-blue-600 hover:underline"
                        type="button"
                        onClick={() => markNotificationAsRead(n.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <button
                    className="ml-2 p-1 text-gray-400 hover:text-red-600"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeNotification(n.id);
                      setOpen(true);
                    }}
                    aria-label="Delete notification"
                    tabIndex={-1}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
} 