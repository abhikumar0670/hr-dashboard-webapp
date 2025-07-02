'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { departments, getDepartmentColor } from '@/lib/utils'
import { StarIcon, BookmarkIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function BookmarksPage() {
  const { bookmarkedEmployees, toggleBookmark, promoteEmployee } = useStore()

  if (bookmarkedEmployees.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            No bookmarked employees
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Bookmark employees from the dashboard to see them here.
          </p>
          <Link href="/" className="btn btn-primary mt-4">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bookmarked Employees
        </h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarkedEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>
                    {employee.firstName} {employee.lastName}
                  </CardTitle>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {employee.email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBookmark(employee.id)}
                >
                  <BookmarkIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Department
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getDepartmentColor(
                      employee.department
                    )}`}
                  >
                    {employee.department}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Age
                  </span>
                  <span className="text-sm font-medium">
                    {employee.age} years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Performance
                  </span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= Math.floor(employee.performance) ? (
                          <StarIcon className="h-5 w-5 text-yellow-400" />
                        ) : (
                          <StarOutlineIcon className="h-5 w-5 text-gray-300" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/employee/${employee.id}`}
                    className="btn btn-primary flex-1"
                  >
                    View Details
                  </Link>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => promoteEmployee(employee.id, 'Senior ' + employee.position)}
                  >
                    Promote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 