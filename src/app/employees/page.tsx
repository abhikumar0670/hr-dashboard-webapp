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
import { getDepartmentColor, formatCurrency, departments, positions, skills } from '@/lib/utils'
import { PromotionModal } from '@/components/modals/PromotionModal'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function EmployeesPage() {
  const {
    employees,
    setEmployees,
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
    initializeLeaveBalances,
  } = useStore()

  const [employeeTab, setEmployeeTab] = useState<'all' | 'active' | 'inactive' | 'terminated' | 'on leave'>('all')
  const [promotionModalEmployeeId, setPromotionModalEmployeeId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load employees if not already loaded
    const loadEmployees = async () => {
      if (employees.length === 0 || employees.length < 10) { // Force reload if less than 10 employees
        setIsLoading(true)
        try {
          const response = await fetch('https://dummyjson.com/users?limit=20')
          const data = await response.json()
          
          // Define Indian names for more realistic data
          const indianNames = {
            male: [
              { firstName: 'Rahul', lastName: 'Sharma' },
              { firstName: 'Arjun', lastName: 'Patel' },
              { firstName: 'Vikram', lastName: 'Singh' },
              { firstName: 'Rajesh', lastName: 'Kumar' },
              { firstName: 'Amit', lastName: 'Gupta' },
              { firstName: 'Suresh', lastName: 'Verma' },
              { firstName: 'Deepak', lastName: 'Yadav' },
              { firstName: 'Karan', lastName: 'Mishra' },
              { firstName: 'Ravi', lastName: 'Chauhan' },
              { firstName: 'Nitin', lastName: 'Joshi' },
            ],
            female: [
              { firstName: 'Priya', lastName: 'Sharma' },
              { firstName: 'Ananya', lastName: 'Patel' },
              { firstName: 'Neha', lastName: 'Singh' },
              { firstName: 'Pooja', lastName: 'Kumar' },
              { firstName: 'Meera', lastName: 'Gupta' },
              { firstName: 'Divya', lastName: 'Verma' },
              { firstName: 'Riya', lastName: 'Yadav' },
              { firstName: 'Sneha', lastName: 'Mishra' },
              { firstName: 'Kavita', lastName: 'Chauhan' },
              { firstName: 'Anjali', lastName: 'Joshi' },
            ],
          }
          
          const indianCities = [
            { city: 'Mumbai', state: 'Maharashtra' },
            { city: 'Delhi', state: 'Delhi' },
            { city: 'Bangalore', state: 'Karnataka' },
            { city: 'Hyderabad', state: 'Telangana' },
            { city: 'Chennai', state: 'Tamil Nadu' },
            { city: 'Kolkata', state: 'West Bengal' },
            { city: 'Pune', state: 'Maharashtra' },
            { city: 'Ahmedabad', state: 'Gujarat' },
            { city: 'Jaipur', state: 'Rajasthan' },
            { city: 'Lucknow', state: 'Uttar Pradesh' },
          ]
          
          const indianLocations = [
            'Andheri East',
            'Koramangala',
            'Bandra West',
            'Salt Lake City',
            'T Nagar',
            'Indiranagar',
            'Powai',
            'Sector 62',
            'Malviya Nagar',
            'Gomti Nagar',
          ]
          
          // Process and transform the data with enhanced Indian details
          const processedEmployees = data.users.map((user: any, index: number) => {
            const gender = user.gender.toLowerCase()
            const nameList = indianNames[gender as keyof typeof indianNames]
            const nameIndex = index % nameList.length
            const { firstName, lastName } = nameList[nameIndex]
            
            // Create Indian-style email
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.in`
            
            // Generate Indian phone number
            const phoneNumber = `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`
            
            // Generate Indian address
            const cityIndex = index % indianCities.length
            const locationIndex = index % indianLocations.length
            const { city, state } = indianCities[cityIndex]
            const address = `${indianLocations[locationIndex]}, ${city}, ${state} - ${Math.floor(Math.random() * 900000 + 100000)}`
            
            // Generate enhanced employee data
            const salary = Math.floor(Math.random() * 8000000 + 300000) // 3L to 80L
            const hireDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
            const position = positions[Math.floor(Math.random() * positions.length)]
            const employeeSkills = skills.slice(0, Math.floor(Math.random() * 6) + 2).sort(() => Math.random() - 0.5)
            const performance = Number((Math.random() * 2 + 3).toFixed(1)) // Random rating between 3 and 5
            
            // Generate performance history
            const performanceHistory = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
              date: new Date(2024 - i, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
              rating: Number((Math.random() * 2 + 3).toFixed(1)),
              review: 'Good performance with room for improvement in specific areas.'
            }))
            
            // Generate projects
            const projectStatusOptions = ['active', 'completed', 'pending'] as const;
            const projects = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
              const status = projectStatusOptions[Math.floor(Math.random() * projectStatusOptions.length)];
              return {
                id: `proj-${index}-${i}`,
                name: `Project ${i + 1}`,
                progress: Math.floor(Math.random() * 100),
                status: status as 'active' | 'completed' | 'pending'
              }
            })
            
            // Generate goals
            const goalStatusOptions = ['pending', 'in-progress', 'completed'] as const;
            const goals = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
              const status = goalStatusOptions[Math.floor(Math.random() * goalStatusOptions.length)];
              return {
                id: `goal-${index}-${i}`,
                title: `Goal ${i + 1}`,
                description: 'Improve performance and achieve targets',
                targetDate: new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                status: status as 'pending' | 'in-progress' | 'completed'
              }
            })
            
            return {
              id: user.id,
              firstName,
              lastName,
              email,
              age: user.age,
              department: departments[Math.floor(Math.random() * departments.length)],
              performance,
              address,
              phone: phoneNumber,
              bio: 'Experienced professional with a strong track record in their field. Demonstrates excellent leadership and technical skills.',
              isBookmarked: false,
              // Enhanced fields
              salary,
              hireDate,
              managerId: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 1 : undefined,
              position,
              skills: employeeSkills,
              performanceHistory,
              leaveBalance: Math.floor(Math.random() * 20) + 5,
              projects,
              goals,
              lastReviewDate: performanceHistory[0]?.date,
              nextReviewDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
              status: (() => {
                const statuses = ['active', 'active', 'active', 'active', 'inactive', 'terminated', 'on leave'] as const;
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                return randomStatus as 'active' | 'inactive' | 'terminated' | 'on leave';
              })()
            }
          })
          setEmployees(processedEmployees)
          // Initialize leave balances for all employees
          initializeLeaveBalances(processedEmployees)
        } catch (error) {
          console.error('Error fetching employees:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    loadEmployees()
    updateEmployeeStatusesForLeave()
  }, [setEmployees, initializeLeaveBalances, updateEmployeeStatusesForLeave, employees.length])

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
  let allEmployeesToShow = filteredEmployees
  if (employeeTab === 'all') {
    allEmployeesToShow = filteredEmployees // show filtered employees
  } else {
    // Apply tab filter on top of existing filters
    allEmployeesToShow = filteredEmployees.filter(emp => emp.status === employeeTab)
  }
  
  // Show all employees without pagination (like in the image)
  const employeesToShow = allEmployeesToShow

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Row as Tabs */}
      <div className="flex flex-wrap gap-4">
        <button
          className={`rounded-lg p-3 min-w-[120px] text-left transition-colors focus:outline-none ${
            employeeTab === 'all' 
              ? 'bg-blue-600 ring-2 ring-blue-400' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setEmployeeTab('all')}
        >
          <div className="text-xs text-gray-200 font-medium">Total Employees</div>
          <div className="text-2xl font-bold text-white">{totalCount}</div>
        </button>
        <button
          className={`rounded-lg p-3 min-w-[120px] text-left transition-colors focus:outline-none ${
            employeeTab === 'active' 
              ? 'bg-green-600 ring-2 ring-green-400' 
              : 'bg-green-700 hover:bg-green-600'
          }`}
          onClick={() => setEmployeeTab('active')}
        >
          <div className="text-xs text-green-200 font-medium">Active Employees</div>
          <div className="text-2xl font-bold text-white">{activeCount}</div>
        </button>
        <button
          className={`rounded-lg p-3 min-w-[120px] text-left transition-colors focus:outline-none ${
            employeeTab === 'inactive' 
              ? 'bg-orange-600 ring-2 ring-orange-400' 
              : 'bg-orange-700 hover:bg-orange-600'
          }`}
          onClick={() => setEmployeeTab('inactive')}
        >
          <div className="text-xs text-orange-200 font-medium">Inactive Employees</div>
          <div className="text-2xl font-bold text-white">{inactiveCount}</div>
        </button>
        <button
          className={`rounded-lg p-3 min-w-[120px] text-left transition-colors focus:outline-none ${
            employeeTab === 'terminated' 
              ? 'bg-red-600 ring-2 ring-red-400' 
              : 'bg-red-700 hover:bg-red-600'
          }`}
          onClick={() => setEmployeeTab('terminated')}
        >
          <div className="text-xs text-red-200 font-medium">Terminated Employees</div>
          <div className="text-2xl font-bold text-white">{terminatedCount}</div>
        </button>
        <button
          className={`rounded-lg p-3 min-w-[120px] text-left transition-colors focus:outline-none ${
            employeeTab === 'on leave' 
              ? 'bg-purple-600 ring-2 ring-purple-400' 
              : 'bg-purple-700 hover:bg-purple-600'
          }`}
          onClick={() => setEmployeeTab('on leave')}
        >
          <div className="text-xs text-purple-200 font-medium">On Leave Employees</div>
          <div className="text-2xl font-bold text-white">{onLeaveCount}</div>
        </button>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {employeeTab === 'all' && 'All Employees'}
          {employeeTab === 'active' && 'Active Employees'}
          {employeeTab === 'inactive' && 'Inactive Employees'}
          {employeeTab === 'terminated' && 'Terminated Employees'}
          {employeeTab === 'on leave' && 'On Leave Employees'}
        </h1>
        <Button
          onClick={() => {
            // Clear storage and force reload
            localStorage.removeItem('hr-dashboard-storage')
            window.location.reload()
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => {
            // Toggle advanced filters (for now just clear all)
            setSearchQuery('')
            setDepartmentFilter([])
            setPerformanceFilter([])
            setSalaryRangeFilter([0, 1000000])
            setPositionFilter([])
            setStatusFilter([])
            setHireDateFilter({ start: '', end: '' })
            setSkillsFilter([])
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Filters
        </Button>
      </div>
      
      {/* Employee Grid (filtered by tab) */}
      <div>
        {employeesToShow.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
                              <StarIcon className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <StarOutlineIcon className="h-4 w-4 text-gray-300" />
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