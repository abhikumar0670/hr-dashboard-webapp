'use client'

import { useState } from 'react'
import { Button } from './Button'
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  UserPlusIcon,
  UserMinusIcon,
  StarIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface BulkActionsProps {
  selectedEmployees: number[]
  totalEmployees: number
  onBulkPromote: () => void
  onBulkExport: () => void
  onBulkDelete: () => void
  onBulkStatusUpdate: (status: 'active' | 'inactive' | 'terminated' | 'on leave') => void
  onSelectAll: () => void
  onClearSelection: () => void
}

export function BulkActions({
  selectedEmployees,
  totalEmployees,
  onBulkPromote,
  onBulkExport,
  onBulkDelete,
  onBulkStatusUpdate,
  onSelectAll,
  onClearSelection,
}: BulkActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (selectedEmployees.length === 0) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {totalEmployees} employees total
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="flex items-center gap-2"
          >
            <EyeIcon className="h-4 w-4" />
            Select All
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="flex items-center gap-2 text-blue-700 dark:text-blue-300"
          >
            <EyeSlashIcon className="h-4 w-4" />
            Clear Selection
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
          Bulk Actions
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={onBulkPromote}
                className="flex items-center gap-2"
              >
                <StarIcon className="h-4 w-4" />
                Promote All
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onBulkExport}
                className="flex items-center gap-2"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                Export Selected
              </Button>

              <div className="relative">
                <select
                  onChange={(e) => {
                    const status = e.target.value as 'active' | 'inactive' | 'terminated' | 'on leave'
                    if (status) onBulkStatusUpdate(status)
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Update Status</option>
                  <option value="active">Set Active</option>
                  <option value="inactive">Set Inactive</option>
                  <option value="terminated">Terminate</option>
                  <option value="on leave">Set On Leave</option>
                </select>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={onBulkDelete}
                className="flex items-center gap-2"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Selected
              </Button>
            </div>

            <div className="mt-3 text-xs text-blue-700 dark:text-blue-300">
              ⚠️ Bulk actions will affect all selected employees. Please review your selection before proceeding.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 