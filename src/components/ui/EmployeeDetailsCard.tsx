'use client'

import { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  getDepartmentColor, 
  getPositionColor, 
  getStatusColor,
  getGoalStatusColor,
  getProjectStatusColor,
  formatCurrency,
  formatDate,
  getYearsOfService
} from '@/lib/utils'
import { 
  StarIcon, 
  BookmarkIcon, 
  EyeIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  StarOutlineIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useState } from 'react'
import { LeaveRequestModal } from '@/components/modals/LeaveRequestModal'
import { PromotionModal } from '@/components/modals/PromotionModal'

interface EmployeeDetailsCardProps {
  employee: any
  onBookmarkToggle: (id: number) => void
  onPromote: (id: number) => void
  isSelected?: boolean
  onSelect?: (id: number) => void
  showCheckbox?: boolean
}

export function EmployeeDetailsCard({ 
  employee, 
  onBookmarkToggle, 
  onPromote, 
  isSelected = false,
  onSelect,
  showCheckbox = false
}: EmployeeDetailsCardProps) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false)

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              {showCheckbox && onSelect && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect(employee.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              )}
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {employee.firstName} {employee.lastName}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {employee.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBookmarkToggle(employee.id)}
              className="ml-2"
            >
              <BookmarkIcon
                className={`h-5 w-5 ${
                  employee.isBookmarked
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{employee.phone}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{employee.email}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{employee.address}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Age: {employee.age} years
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Professional Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Department</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Position</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getPositionColor(employee.position)}`}>
                    {employee.position}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Years of Service</span>
                  <span className="text-sm font-medium">
                    {getYearsOfService(employee.hireDate)} years
                  </span>
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setIsPromotionModalOpen(true)}
                  >
                    <ArrowUpIcon className="h-4 w-4" />
                    Promote
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Change History */}
            {employee.statusHistory && employee.statusHistory.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  Status Change History
                </h3>
                <div className="space-y-2">
                  {employee.statusHistory.map((entry: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatDate(entry.date)}</span>
                        <span className="text-gray-500">{entry.oldStatus} → {entry.newStatus}</span>
                      </div>
                      {entry.reason && (
                        <span className="text-gray-400 mt-1 md:mt-0 md:ml-4">Reason: {entry.reason}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5" />
                Financial Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Salary</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(employee.salary)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Hire Date</span>
                  <span className="text-sm font-medium">
                    {formatDate(employee.hireDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Leave Balance</span>
                  <span className="text-sm font-medium">
                    {employee.leaveBalance} days
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Performance Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Performance Rating</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= Math.floor(employee.performance) ? (
                          <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-4 w-4 text-gray-300" />
                        )}
                      </span>
                    ))}
                    <span className="text-sm font-medium ml-1">({employee.performance})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Last Review</span>
                  <span className="text-sm font-medium">
                    {employee.lastReviewDate ? formatDate(employee.lastReviewDate) : 'Not reviewed'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Next Review</span>
                  <span className="text-sm font-medium">
                    {formatDate(employee.nextReviewDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5" />
                Skills ({employee.skills.length})
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BriefcaseIcon className="h-5 w-5" />
                Projects ({employee.projects.length})
              </h3>
              
              <div className="space-y-2">
                {employee.projects.map((project: any) => (
                  <div key={project.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{project.name}</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getProjectStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{project.progress}% complete</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                Goals ({employee.goals.length})
              </h3>
              
              <div className="space-y-2">
                {employee.goals.map((goal: any) => (
                  <div key={goal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{goal.title}</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getGoalStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{goal.description}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="h-3 w-3" />
                      Target: {formatDate(goal.targetDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance History */}
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Performance History
              </h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="space-y-3">
                  {employee.performanceHistory.map((review: any, index: number) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-600 pb-2 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatDate(review.date)}</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= Math.floor(review.rating) ? (
                                <StarSolidIcon className="h-3 w-3 text-yellow-400" />
                              ) : (
                                <StarIcon className="h-3 w-3 text-gray-300" />
                              )}
                            </span>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({review.rating})</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 max-w-xs truncate">{review.review}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button
              onClick={() => setIsLeaveModalOpen(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Request Leave
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onPromote(employee.id)}
            >
              Promote
            </Button>
            <Link
              href={`/employee/${employee.id}`}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <EyeIcon className="h-4 w-4" />
              View Full Details
            </Link>
          </div>
        </CardContent>
      </div>

      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        employeeId={employee.id}
        employeeName={`${employee.firstName} ${employee.lastName}`}
      />

      <PromotionModal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        employeeId={employee.id}
        employeeName={`${employee.firstName} ${employee.lastName}`}
        currentPosition={employee.position}
      />

      {/* Promotion History */}
      {employee.promotionHistory && employee.promotionHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ArrowUpIcon className="h-5 w-5" />
            Promotion History
          </h3>
          <div className="space-y-2">
            {employee.promotionHistory.map((entry: any, idx: number) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{formatDate(entry.date)}</span>
                  <span className="text-gray-500">{entry.oldPosition} → {entry.newPosition}</span>
                </div>
                {entry.reason && (
                  <span className="text-gray-400 mt-1 md:mt-0 md:ml-4">Reason: {entry.reason}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
} 