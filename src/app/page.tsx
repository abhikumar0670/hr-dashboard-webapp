'use client'

import { useEffect, useState } from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { Button } from '@/components/ui/Button'
import { BulkActions } from '@/components/ui/BulkActions'
import { AdvancedFilters } from '@/components/ui/AdvancedFilters'
import { EmployeeComparison } from '@/components/ui/EmployeeComparison'
import { EmployeeDetailsCard } from '@/components/ui/EmployeeDetailsCard'
import { useStore } from '@/store/useStore'
import { 
  departments, 
  positions, 
  skills,
  getDepartmentColor, 
  getPositionColor, 
  getStatusColor,
  formatCurrency,
  formatDate,
  getYearsOfService,
  filterEmployees,
  exportToCSV
} from '@/lib/utils'
import { StarIcon, BookmarkIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, ScaleIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { CreateUserModal } from '@/components/modals/CreateUserModal'
import { AnimatePresence, motion } from 'framer-motion'

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

const ITEMS_PER_PAGE = 3

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
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
    selectedEmployees,
    setSelectedEmployees,
    positionFilter,
    setPositionFilter,
    statusFilter,
    setStatusFilter,
    hireDateFilter,
    setHireDateFilter,
    skillsFilter,
    setSkillsFilter,
    toggleBookmark,
    promoteEmployee,
    bulkPromoteEmployees,
    updateEmployeeStatus,
    deleteEmployee,
    initializeLeaveBalances,
    updateEmployeeStatusesForLeave,
  } = useStore()

  useEffect(() => {
    // Only fetch if there is no data in localStorage (first ever load)
    const persisted = typeof window !== 'undefined' ? localStorage.getItem('hr-dashboard-storage') : null;
    let hasPersistedEmployees = false;
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        hasPersistedEmployees = parsed?.state?.employees?.length > 0;
      } catch {}
    }
    if (!hasPersistedEmployees) {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users?limit=20')
        const data = await response.json()
        
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
              const projects = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
                id: `proj-${index}-${i}`,
                name: `Project ${i + 1}`,
                progress: Math.floor(Math.random() * 100),
                status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'completed' | 'pending'
              }))

              // Generate goals
              const goals = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
                id: `goal-${index}-${i}`,
                title: `Goal ${i + 1}`,
                description: 'Improve performance and achieve targets',
                targetDate: new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                status: ['pending', 'in-progress', 'completed'][Math.floor(Math.random() * 3)] as 'pending' | 'in-progress' | 'completed'
              }))

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
                status: ['active', 'active', 'active', 'inactive', 'on leave'][Math.floor(Math.random() * 5)] as 'active' | 'inactive' | 'terminated' | 'on leave'
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
    fetchEmployees()
    } else {
      setIsLoading(false)
    }
  }, [setEmployees, initializeLeaveBalances])

  useEffect(() => {
    updateEmployeeStatusesForLeave()
  }, [updateEmployeeStatusesForLeave])

  const filteredEmployees = filterEmployees(employees, {
    searchQuery,
    departmentFilter,
    performanceFilter,
    salaryRangeFilter,
    positionFilter,
    statusFilter,
    hireDateFilter,
    skillsFilter,
  })

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, departmentFilter, performanceFilter, salaryRangeFilter, positionFilter, statusFilter, hireDateFilter, skillsFilter])

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  // Bulk action handlers
  const handleBulkPromote = () => {
    bulkPromoteEmployees(selectedEmployees)
    setSelectedEmployees([])
  }

  const handleBulkExport = () => {
    const selectedEmployeeData = employees.filter(emp => selectedEmployees.includes(emp.id))
    exportToCSV(selectedEmployeeData)
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedEmployees.length} employees?`)) {
      selectedEmployees.forEach(id => deleteEmployee(id))
      setSelectedEmployees([])
    }
  }

  const handleBulkStatusUpdate = (status: 'active' | 'inactive' | 'terminated' | 'on leave') => {
    selectedEmployees.forEach(id => updateEmployeeStatus(id, status))
    setSelectedEmployees([])
  }

  const handleSelectAll = () => {
    setSelectedEmployees(filteredEmployees.map(emp => emp.id))
  }

  const handleClearSelection = () => {
    setSelectedEmployees([])
  }

  const handleClearAllFilters = () => {
    setSearchQuery('')
    setDepartmentFilter([])
    setPerformanceFilter([])
    setSalaryRangeFilter([0, 1000000])
    setPositionFilter([])
    setStatusFilter([])
    setHireDateFilter({ start: '', end: '' })
    setSkillsFilter([])
  }

  const handleEmployeeSelect = (employeeId: number) => {
    const currentSelected = selectedEmployees
    if (currentSelected.includes(employeeId)) {
      setSelectedEmployees(currentSelected.filter(id => id !== employeeId))
    } else {
      setSelectedEmployees([...currentSelected, employeeId])
    }
  }

  const handleRemoveFromComparison = (employeeId: number) => {
    setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Dashboard
          </h1>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Employee
          </Button>
          <Button
            onClick={() => selectedEmployees.length > 0 && setIsComparisonOpen(true)}
            className="flex items-center gap-2"
            variant="secondary"
            disabled={selectedEmployees.length === 0}
          >
            <ScaleIcon className="h-5 w-5" />
            Compare{selectedEmployees.length > 0 ? ` (${selectedEmployees.length})` : ''}
          </Button>
        </div>
      </motion.div>

      {/* Advanced Filters */}
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
        onClearAll={handleClearAllFilters}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedEmployees={selectedEmployees}
        totalEmployees={filteredEmployees.length}
        onBulkPromote={handleBulkPromote}
        onBulkExport={handleBulkExport}
        onBulkDelete={handleBulkDelete}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-64 items-center justify-center"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {paginatedEmployees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EmployeeDetailsCard
                    employee={employee}
                    onBookmarkToggle={toggleBookmark}
                    onPromote={promoteEmployee}
                    isSelected={selectedEmployees.includes(employee.id)}
                    onSelect={handleEmployeeSelect}
                    showCheckbox={true}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {filteredEmployees.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-64 flex-col items-center justify-center text-center"
            >
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                No employees found
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </>
      )}

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {isComparisonOpen && (
        <EmployeeComparison
          employees={employees}
          selectedEmployees={selectedEmployees}
          onClose={() => setIsComparisonOpen(false)}
          onRemoveEmployee={handleRemoveFromComparison}
        />
      )}
    </motion.div>
  )
} 