'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import {
  getDepartmentColor,
  getPositionColor,
  getStatusColor,
  getGoalStatusColor,
  getProjectStatusColor,
  formatCurrency,
  formatDate,
  getYearsOfService,
} from '@/lib/utils'
import {
  StarIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import { LeaveRequestModal } from '@/components/modals/LeaveRequestModal'
import { PromotionModal } from '@/components/modals/PromotionModal'
import { PerformanceReviewModal } from '@/components/modals/PerformanceReviewModal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function EmployeeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { employees, toggleBookmark, promoteEmployee, updateEmployeeStatus, getLeaveBalance, getEmployeeLeaveRequests } = useStore()
  const [employee, setEmployee] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  useEffect(() => {
    const employeeId = Number(params.id)
    const foundEmployee = employees.find(emp => emp.id === employeeId)
    
    if (foundEmployee) {
      setEmployee(foundEmployee)
    }
    setIsLoading(false)
  }, [params.id, employees])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-gray-900 dark:text-white">
            Employee not found
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The employee you're looking for doesn't exist
        </p>
        <Button
          onClick={() => router.push('/')}
          className="mt-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  // Performance history chart data
  const performanceHistoryData = {
    labels: (employee.performanceHistory ?? []).map((review: any) => formatDate(review.date)),
    datasets: [
      {
        label: 'Performance Rating',
        data: (employee.performanceHistory ?? []).map((review: any) => review.rating),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Skills distribution chart data
  const skillsData = {
    labels: employee.skills ?? [],
    datasets: [
      {
        data: (employee.skills ?? []).map(() => 100 / (employee.skills?.length || 1)), // Equal distribution for visualization
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(99, 102, 241, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  const performanceChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'inactive':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'terminated':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const leaveBalance = getLeaveBalance(employee.id)
  const leaveRequests = getEmployeeLeaveRequests(employee.id)

  return (
    <>
    <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
        <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {employee.firstName} {employee.lastName}
          </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {employee.position} • {employee.department}
              </p>
            </div>
        </div>
          <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => toggleBookmark(employee.id)}
              className="flex items-center gap-2"
          >
            <BookmarkIcon
                className={`h-5 w-5 ${
                employee.isBookmarked
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
            {employee.isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
            <Button
              onClick={() => setIsPromotionModalOpen(true)}
              className="flex items-center gap-2"
              variant="secondary"
            >
              <StarSolidIcon className="h-5 w-5" />
              Promote
            </Button>
          </div>
        </motion.div>

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <AnimatedCard index={0}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium">{employee.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                  <p className="font-medium">{employee.age} years old</p>
        </div>
      </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Years of Service</p>
                  <p className="font-medium">{getYearsOfService(employee.hireDate)} years</p>
                </div>
      </div>
            </CardContent>
          </AnimatedCard>

          {/* Professional Information */}
          <AnimatedCard index={1}>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5" />
                Professional Information
              </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                <span className={`inline-block mt-1 rounded-full px-2 py-1 text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                      {employee.department}
                    </span>
                  </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Position</p>
                <span className={`inline-block mt-1 rounded-full px-2 py-1 text-xs font-medium ${getPositionColor(employee.position)}`}>
                  {employee.position}
                    </span>
                  </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(employee.status)}
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {employee.status}
                    </span>
                  </div>
                </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Performance Rating</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= Math.floor(employee.performance) ? (
                          <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                          ) : (
                          <StarIcon className="h-5 w-5 text-gray-300" />
                          )}
                        </span>
                      ))}
                  </div>
                  <span className="font-medium">{employee.performance}/5.0</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Leave Balance</p>
                <p className="font-medium">{employee.leaveBalance} days</p>
              </div>
            </CardContent>
          </AnimatedCard>

          {/* Financial Information */}
          <AnimatedCard index={2}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrencyRupeeIcon className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Salary</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(employee.salary)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hire Date</p>
                <p className="font-medium">{formatDate(employee.hireDate)}</p>
              </div>
              {employee.lastReviewDate && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Review</p>
                  <p className="font-medium">{formatDate(employee.lastReviewDate)}</p>
                  </div>
              )}
              {employee.nextReviewDate && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Next Review</p>
                  <p className="font-medium">{formatDate(employee.nextReviewDate)}</p>
                </div>
              )}
              {employee.managerId && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manager ID</p>
                  <p className="font-medium">#{employee.managerId}</p>
          </div>
        )}
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Skills and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedCard index={3}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5" />
                Skills ({employee.skills?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Doughnut data={skillsData} options={chartOptions} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {(employee.skills ?? []).length > 0 ? (
                  (employee.skills ?? []).map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No skills listed</span>
                )}
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard index={4}>
            <CardHeader>
              <CardTitle>Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={performanceHistoryData} options={performanceChartOptions} />
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Projects and Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedCard index={5}>
            <CardHeader>
              <CardTitle>Current Projects ({employee.projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.projects.map((project: any) => (
                  <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{project.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard index={6}>
            <CardHeader>
              <CardTitle>Goals ({employee.goals.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employee.goals.map((goal: any) => (
                  <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{goal.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGoalStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {goal.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Target Date: {formatDate(goal.targetDate)}
                        </p>
                      </div>
                ))}
              </div>
            </CardContent>
          </AnimatedCard>
        </div>

        {/* Performance Reviews */}
        <AnimatedCard index={7}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Performance Reviews ({employee.performanceHistory.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReviewModalOpen(true)}
                className="ml-2"
              >
                + Add Review
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employee.performanceHistory.map((review: any, index: number) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatDate(review.date)}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= Math.floor(review.rating) ? (
                              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <StarIcon className="h-4 w-4 text-gray-300" />
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="font-medium">{review.rating}/5.0</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {review.review}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>

        {/* Bio */}
        <AnimatedCard index={8}>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {employee.bio}
            </p>
          </CardContent>
        </AnimatedCard>

        {/* Leave Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Leave Management
              </div>
              <Button
                onClick={() => setIsLeaveModalOpen(true)}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Request Leave
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Leave Balance */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Leave Balance</h4>
                {leaveBalance ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(leaveBalance).map(([type, balance]) => {
                      if (type === 'employeeId') return null
                      const leaveType = type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
                      return (
                        <div key={type} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <div className="text-sm text-gray-600 dark:text-gray-300">{leaveType}</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">{balance}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">days remaining</div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-300">No leave balance information available</p>
                )}
              </div>

              {/* Leave History */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Leave History</h4>
                {leaveRequests.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {leaveRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}> {request.status.toUpperCase()} </span>
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            {formatDate(request.submittedAt)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">{request.leaveType.replace('-', ' ').toUpperCase()}</div>
                          <div className="text-gray-600 dark:text-gray-200">
                            {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.totalDays} days)
                          </div>
                          <div className="text-gray-500 dark:text-gray-300 mt-1">{request.reason}</div>
                          {request.comments && (
                            <div className="text-gray-500 dark:text-gray-300 mt-1">
                              <span className="font-medium">HR Comments:</span> {request.comments}
                            </div>
                          )}
                        </div>
                  </div>
                ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-300">No leave requests found</p>
                )}
              </div>
              </div>
            </CardContent>
          </Card>

        {/* Promotion History */}
        {employee.promotionHistory && employee.promotionHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <StarSolidIcon className="h-5 w-5" />
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

      <PerformanceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        employeeId={employee.id}
        employeeName={`${employee.firstName} ${employee.lastName}`}
      />
    </>
  )
} 