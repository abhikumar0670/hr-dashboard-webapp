'use client'

import { useState } from 'react'
import { Button } from './Button'
import { 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { departments, positions, skills } from '@/lib/utils'

interface AdvancedFiltersProps {
  searchQuery: string
  departmentFilter: string[]
  performanceFilter: number[]
  salaryRangeFilter: [number, number]
  positionFilter: string[]
  statusFilter: string[]
  hireDateFilter: { start: string; end: string }
  skillsFilter: string[]
  onSearchChange: (query: string) => void
  onDepartmentChange: (departments: string[]) => void
  onPerformanceChange: (ratings: number[]) => void
  onSalaryRangeChange: (range: [number, number]) => void
  onPositionChange: (positions: string[]) => void
  onStatusChange: (statuses: string[]) => void
  onHireDateChange: (dates: { start: string; end: string }) => void
  onSkillsChange: (skills: string[]) => void
  onClearAll: () => void
}

export function AdvancedFilters({
  searchQuery,
  departmentFilter,
  performanceFilter,
  salaryRangeFilter,
  positionFilter,
  statusFilter,
  hireDateFilter,
  skillsFilter,
  onSearchChange,
  onDepartmentChange,
  onPerformanceChange,
  onSalaryRangeChange,
  onPositionChange,
  onStatusChange,
  onHireDateChange,
  onSkillsChange,
  onClearAll,
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localSalaryRange, setLocalSalaryRange] = useState<[number, number]>(salaryRangeFilter)

  const hasActiveFilters = 
    searchQuery ||
    departmentFilter.length > 0 ||
    performanceFilter.length > 0 ||
    salaryRangeFilter[0] !== 0 ||
    salaryRangeFilter[1] !== 1000000 ||
    positionFilter.length > 0 ||
    statusFilter.length > 0 ||
    hireDateFilter.start ||
    hireDateFilter.end ||
    skillsFilter.length > 0

  const handleSalaryRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : 0
    const newRange: [number, number] = type === 'min' 
      ? [numValue, localSalaryRange[1]]
      : [localSalaryRange[0], numValue]
    
    setLocalSalaryRange(newRange)
  }

  const applySalaryRange = () => {
    onSalaryRangeChange(localSalaryRange)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Basic Search */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 input"
        />
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <FunnelIcon className="h-4 w-4" />
          {isExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearAll}
            className="flex items-center gap-2 text-red-600 dark:text-red-400"
          >
            <XMarkIcon className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                multiple
                value={departmentFilter}
                onChange={(e) =>
                  onDepartmentChange(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full input"
                size={4}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Position Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Position
              </label>
              <select
                multiple
                value={positionFilter}
                onChange={(e) =>
                  onPositionChange(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full input"
                size={4}
              >
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Performance Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Performance Rating
              </label>
              <select
                multiple
                value={performanceFilter.map(String)}
                onChange={(e) =>
                  onPerformanceChange(
                    Array.from(e.target.selectedOptions, (option) =>
                      Number(option.value)
                    )
                  )
                }
                className="w-full input"
                size={4}
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                multiple
                value={statusFilter}
                onChange={(e) =>
                  onStatusChange(
                    Array.from(e.target.selectedOptions, (option) => option.value)
                  )
                }
                className="w-full input"
                size={4}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
                <option value="on leave">On Leave</option>
              </select>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Range
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localSalaryRange[0] || ''}
                    onChange={(e) => handleSalaryRangeChange('min', e.target.value)}
                    className="flex-1 input text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localSalaryRange[1] || ''}
                    onChange={(e) => handleSalaryRangeChange('max', e.target.value)}
                    className="flex-1 input text-sm"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applySalaryRange}
                  className="w-full"
                >
                  Apply Range
                </Button>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Current: {formatCurrency(salaryRangeFilter[0])} - {formatCurrency(salaryRangeFilter[1])}
                </div>
              </div>
            </div>

            {/* Hire Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hire Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={hireDateFilter.start}
                  onChange={(e) => onHireDateChange({ ...hireDateFilter, start: e.target.value })}
                  className="w-full input text-sm"
                />
                <input
                  type="date"
                  value={hireDateFilter.end}
                  onChange={(e) => onHireDateChange({ ...hireDateFilter, end: e.target.value })}
                  className="w-full input text-sm"
                />
              </div>
            </div>

            {/* Skills Filter */}
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {skills.map((skill) => (
                  <label key={skill} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={skillsFilter.includes(skill)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSkillsChange([...skillsFilter, skill])
                        } else {
                          onSkillsChange(skillsFilter.filter(s => s !== skill))
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              Search: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-blue-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
          {departmentFilter.map((dept) => (
            <span key={dept} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full">
              Dept: {dept}
              <button
                onClick={() => onDepartmentChange(departmentFilter.filter(d => d !== dept))}
                className="ml-1 hover:text-purple-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          {positionFilter.map((pos) => (
            <span key={pos} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
              Position: {pos}
              <button
                onClick={() => onPositionChange(positionFilter.filter(p => p !== pos))}
                className="ml-1 hover:text-green-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          {performanceFilter.map((rating) => (
            <span key={rating} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full">
              {rating}★
              <button
                onClick={() => onPerformanceChange(performanceFilter.filter(r => r !== rating))}
                className="ml-1 hover:text-yellow-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          {skillsFilter.map((skill) => (
            <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 rounded-full">
              {skill}
              <button
                onClick={() => onSkillsChange(skillsFilter.filter(s => s !== skill))}
                className="ml-1 hover:text-indigo-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
} 