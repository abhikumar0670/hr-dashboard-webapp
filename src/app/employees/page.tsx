'use client'

import { useStore } from '@/store/useStore'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AdvancedFilters } from '@/components/ui/AdvancedFilters'
import { BulkActions } from '@/components/ui/BulkActions'
import { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { getDepartmentColor, formatCurrency } from '@/lib/utils'
import { PromotionModal } from '@/components/modals/PromotionModal'

export default function EmployeesPage() {
  const {
    employees,
    searchQuery,
    setSearchQuery,
    departmentFilter,
    setDepartmentFilter,
    performanceFilter,
    setPerformanceFilter,
    salaryRangeFilter,
    setSalaryRangeFilter,
    positionFilter,
    setPositionFilter,
    statusFilter,
    setStatusFilter,
    hireDateFilter,
    setHireDateFilter,
    skillsFilter,
    setSkillsFilter,
    selectedEmployees,
    setSelectedEmployees,
    toggleBookmark,
    promoteEmployee,
    updateEmployeeStatusesForLeave,
  } = useStore()

  const [employeeTab, setEmployeeTab] = useState<'all' | 'active' | 'inactive' | 'terminated' | 'on leave'>('all')
  const [promotionModalEmployeeId, setPromotionModalEmployeeId] = useState<number | null>(null)

  useEffect(() => {
    updateEmployeeStatusesForLeave()
  }, [updateEmployeeStatusesForLeave])

  // Filtering logic (reuse from dashboard)
  const filteredEmployees = employees.filter((employee) => {
    // Search query
    const matchesSearch =
      searchQuery === '' ||
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())

    // Department filter
    const matchesDepartment =
      departmentFilter.length === 0 ||
      departmentFilter.includes(employee.department)

    // Performance filter
    const matchesPerformance =
      performanceFilter.length === 0 ||
      performanceFilter.includes(Math.floor(employee.performance))

    // Salary range filter
    const matchesSalary =
      employee.salary >= salaryRangeFilter[0] &&
      employee.salary <= salaryRangeFilter[1]

    // Position filter
    const matchesPosition =
      positionFilter.length === 0 ||
      positionFilter.includes(employee.position)

    // Status filter
    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(employee.status)

    // Hire date filter
    const matchesHireDate =
      !hireDateFilter.start ||
      !hireDateFilter.end ||
      (new Date(employee.hireDate) >= new Date(hireDateFilter.start) &&
        new Date(employee.hireDate) <= new Date(hireDateFilter.end))

    // Skills filter
    const matchesSkills =
      skillsFilter.length === 0 ||
      skillsFilter.some((skill) => employee.skills.includes(skill))

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesPerformance &&
      matchesSalary &&
      matchesPosition &&
      matchesStatus &&
      matchesHireDate &&
      matchesSkills
    )
  })

  const activeEmployees = filteredEmployees.filter(emp => emp.status === 'active')
  const inactiveEmployees = filteredEmployees.filter(emp => emp.status === 'inactive')
  const terminatedEmployees = filteredEmployees.filter(emp => emp.status === 'terminated')
  const onLeaveEmployees = filteredEmployees.filter(emp => emp.status === 'on leave')

  // For summary, use all employees (not just filtered)
  const totalCount = employees.length
  const activeCount = employees.filter(emp => emp.status === 'active').length
  const inactiveCount = employees.filter(emp => emp.status === 'inactive').length
  const terminatedCount = employees.filter(emp => emp.status === 'terminated').length
  const onLeaveCount = employees.filter(emp => emp.status === 'on leave').length

  // Determine which employees to show based on tab
  let employeesToShow = filteredEmployees
  if (employeeTab === 'all') employeesToShow = employees // show all employees, unfiltered
  if (employeeTab === 'active') employeesToShow = employees.filter(emp => emp.status === 'active')
  if (employeeTab === 'inactive') employeesToShow = employees.filter(emp => emp.status === 'inactive')
  if (employeeTab === 'terminated') employeesToShow = employees.filter(emp => emp.status === 'terminated')
  if (employeeTab === 'on leave') employeesToShow = employees.filter(emp => emp.status === 'on leave')

  return (
    <div className="space-y-8">
      {/* Summary Row as Tabs */}
      <div className="flex flex-wrap gap-4 mb-2">
        <button
          className={`rounded-lg p-4 w-48 text-left transition-colors focus:outline-none ${employeeTab === 'all' ? 'bg-gray-900 ring-2 ring-blue-400' : 'bg-gray-900 hover:ring-2 hover:ring-blue-300'}`}
          onClick={() => setEmployeeTab('all')}
        >
          <div className="text-sm text-gray-200 font-semibold">Total Employees</div>
          <div className="text-3xl font-bold text-white">{totalCount}</div>
        </button>
        <button
          className={`rounded-lg p-4 w-48 text-left transition-colors focus:outline-none ${employeeTab === 'active' ? 'bg-green-800 ring-2 ring-green-400' : 'bg-green-900 hover:ring-2 hover:ring-green-300'}`}
          onClick={() => setEmployeeTab('active')}
        >
          <div className="text-sm text-green-200 font-semibold">Active Employees</div>
          <div className="text-3xl font-bold text-white">{activeCount}</div>
        </button>
        <button
          className={`rounded-lg p-4 w-48 text-left transition-colors focus:outline-none ${employeeTab === 'inactive' ? 'bg-yellow-800 ring-2 ring-yellow-400' : 'bg-yellow-900 hover:ring-2 hover:ring-yellow-300'}`}
          onClick={() => setEmployeeTab('inactive')}
        >
          <div className="text-sm text-yellow-200 font-semibold">Inactive Employees</div>
          <div className="text-3xl font-bold text-white">{inactiveCount}</div>
        </button>
        <button
          className={`rounded-lg p-4 w-48 text-left transition-colors focus:outline-none ${employeeTab === 'terminated' ? 'bg-red-800 ring-2 ring-red-400' : 'bg-red-900 hover:ring-2 hover:ring-red-300'}`}
          onClick={() => setEmployeeTab('terminated')}
        >
          <div className="text-sm text-red-200 font-semibold">Terminated Employees</div>
          <div className="text-3xl font-bold text-white">{terminatedCount}</div>
        </button>
        <button
          className={`rounded-lg p-4 w-48 text-left transition-colors focus:outline-none ${employeeTab === 'on leave' ? 'bg-purple-800 ring-2 ring-purple-400' : 'bg-purple-900 hover:ring-2 hover:ring-purple-300'}`}
          onClick={() => setEmployeeTab('on leave')}
        >
          <div className="text-sm text-purple-200 font-semibold">On Leave Employees</div>
          <div className="text-3xl font-bold text-white">{onLeaveCount}</div>
        </button>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Employees</h1>
      <AdvancedFilters
        searchQuery={searchQuery}
        departmentFilter={departmentFilter}
        performanceFilter={performanceFilter}
        salaryRangeFilter={salaryRangeFilter}
        positionFilter={positionFilter}
        statusFilter={statusFilter}
        hireDateFilter={hireDateFilter}
        skillsFilter={skillsFilter}
        onSearchChange={setSearchQuery}
        onDepartmentChange={setDepartmentFilter}
        onPerformanceChange={setPerformanceFilter}
        onSalaryRangeChange={setSalaryRangeFilter}
        onPositionChange={setPositionFilter}
        onStatusChange={setStatusFilter}
        onHireDateChange={setHireDateFilter}
        onSkillsChange={setSkillsFilter}
        onClearAll={() => {
          setSearchQuery('')
          setDepartmentFilter([])
          setPerformanceFilter([])
          setSalaryRangeFilter([0, 1000000])
          setPositionFilter([])
          setStatusFilter([])
          setHireDateFilter({ start: '', end: '' })
          setSkillsFilter([])
        }}
      />
      {/* Employee Grid (filtered by tab) */}
      <div>
        {employeesToShow.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {employeesToShow.map((employee, index) => (
              <AnimatedCard key={employee.id} index={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => {
                          if (selectedEmployees.includes(employee.id)) {
                            setSelectedEmployees(selectedEmployees.filter((id) => id !== employee.id))
                          } else {
                            setSelectedEmployees([...selectedEmployees, employee.id])
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <CardTitle>
                          {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleBookmark(employee.id)}
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
                        onClick={() => setPromotionModalEmployeeId(employee.id)}
                      >
                        Promote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No employees found.</div>
        )}
      </div>
      {/* Promotion Modal for Employee Cards */}
      {promotionModalEmployeeId !== null && (
        <PromotionModal
          isOpen={promotionModalEmployeeId !== null}
          onClose={() => setPromotionModalEmployeeId(null)}
          employeeId={promotionModalEmployeeId}
          employeeName={`${employees.find(e => e.id === promotionModalEmployeeId)?.firstName || ''} ${employees.find(e => e.id === promotionModalEmployeeId)?.lastName || ''}`}
          currentPosition={employees.find(e => e.id === promotionModalEmployeeId)?.position || ''}
        />
      )}
    </div>
  )
} 