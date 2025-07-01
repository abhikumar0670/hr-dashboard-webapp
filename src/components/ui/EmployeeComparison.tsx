'use client'

import { useState } from 'react'
import { Button } from './Button'
import { CardContent, CardHeader, CardTitle } from './Card'
import { 
  XMarkIcon,
  UserIcon,
  CurrencyRupeeIcon,
  StarIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency, formatDate, getYearsOfService, getDepartmentColor, getPositionColor, getStatusColor } from '@/lib/utils'
import { Employee } from '@/store/useStore'

interface EmployeeComparisonProps {
  employees: Employee[]
  selectedEmployees: number[]
  onClose: () => void
  onRemoveEmployee: (employeeId: number) => void
}

export function EmployeeComparison({
  employees,
  selectedEmployees,
  onClose,
  onRemoveEmployee,
}: EmployeeComparisonProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'salary' | 'skills'>('overview')
  
  const selectedEmployeeData = employees.filter(emp => selectedEmployees.includes(emp.id))

  if (selectedEmployeeData.length === 0) {
    return null
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'performance', label: 'Performance', icon: StarIcon },
    { id: 'salary', label: 'Salary', icon: CurrencyRupeeIcon },
    { id: 'skills', label: 'Skills', icon: AcademicCapIcon },
  ]

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSalaryComparison = () => {
    const salaries = selectedEmployeeData.map(emp => emp.salary)
    const maxSalary = Math.max(...salaries)
    const minSalary = Math.min(...salaries)
    
    return selectedEmployeeData.map(emp => ({
      ...emp,
      salaryPercentage: ((emp.salary - minSalary) / (maxSalary - minSalary)) * 100
    }))
  }

  const getSkillsComparison = () => {
    const allSkills = new Set(selectedEmployeeData.flatMap(emp => emp.skills))
    return Array.from(allSkills).map(skill => ({
      skill,
      employees: selectedEmployeeData.filter(emp => emp.skills.includes(skill))
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="w-full h-full rounded-none p-0 bg-white dark:bg-gray-900 flex flex-col shadow-xl sm:max-w-full sm:h-auto sm:rounded-lg sm:p-4 sm:items-center sm:justify-center sm:relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header for mobile, normal for desktop */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:static sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Employee Comparison
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comparing {selectedEmployeeData.length} employees
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            className="flex items-center gap-2 py-3 px-4 text-lg rounded-xl"
          >
            <XMarkIcon className="h-6 w-6" />
            Close
          </Button>
        </div>

        {/* Sticky Tabs for mobile, normal for desktop */}
        <div className="sticky top-[56px] z-10 flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-3 sm:px-6 sm:py-3 text-base sm:text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto max-h-full sm:max-h-[calc(80vh-120px)] hide-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-3 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
                  {selectedEmployeeData.map((employee, idx) => (
                    <div
                      key={employee.id}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 w-full"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Employee {idx + 1}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveEmployee(employee.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        {employee.email}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Department</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(employee.department)}`}>
                            {employee.department}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Position</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(employee.position)}`}>
                            {employee.position}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Age</span>
                          <span className="text-sm font-medium">{employee.age} years</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Years of Service</span>
                          <span className="text-sm font-medium">{getYearsOfService(employee.hireDate)} years</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Performance</span>
                          <div className="flex items-center gap-1">
                            <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>{employee.performance}</span>
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                          </div>
                        </div>
                      </div>
                      {idx < selectedEmployeeData.length - 1 && (
                        <div className="my-4 border-b border-gray-300 dark:border-gray-700" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="space-y-6">
                  {/* Performance Ratings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Performance Ratings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedEmployeeData.map((employee) => (
                        <div
                          key={employee.id}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {employee.firstName} {employee.lastName}
                            </h4>
                            <span className={`text-lg font-bold ${getPerformanceColor(employee.performance)}`}>
                              {employee.performance}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.floor(employee.performance)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>

                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(employee.performance / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance History */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Performance History
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2">Employee</th>
                            <th className="text-left py-2">Date</th>
                            <th className="text-left py-2">Rating</th>
                            <th className="text-left py-2">Review</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEmployeeData.flatMap(employee =>
                            employee.performanceHistory.slice(0, 2).map((review, index) => (
                              <tr key={`${employee.id}-${index}`} className="border-b border-gray-100 dark:border-gray-800">
                                <td className="py-2 font-medium">{employee.firstName} {employee.lastName}</td>
                                <td className="py-2">{formatDate(review.date)}</td>
                                <td className="py-2">
                                  <span className={`font-medium ${getPerformanceColor(review.rating)}`}>
                                    {review.rating}
                                  </span>
                                </td>
                                <td className="py-2 text-gray-600 dark:text-gray-400 truncate max-w-xs">
                                  {review.review}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'salary' && (
              <motion.div
                key="salary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="space-y-6">
                  {/* Salary Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Salary Comparison
                    </h3>
                    <div className="space-y-4">
                      {getSalaryComparison().map((employee) => (
                        <div key={employee.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {employee.firstName} {employee.lastName}
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {formatCurrency(employee.salary)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${employee.salaryPercentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Salary Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(Math.min(...selectedEmployeeData.map(emp => emp.salary)))}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">Lowest</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(Math.max(...selectedEmployeeData.map(emp => emp.salary)))}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">Highest</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {formatCurrency(
                          selectedEmployeeData.reduce((sum, emp) => sum + emp.salary, 0) / selectedEmployeeData.length
                        )}
                      </div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Average</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {formatCurrency(
                          Math.max(...selectedEmployeeData.map(emp => emp.salary)) - 
                          Math.min(...selectedEmployeeData.map(emp => emp.salary))
                        )}
                      </div>
                      <div className="text-sm text-orange-600 dark:text-orange-400">Range</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <div className="space-y-6">
                  {/* Skills Matrix */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Skills Matrix
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-2">Skill</th>
                            {selectedEmployeeData.map((employee) => (
                              <th key={employee.id} className="text-center py-2">
                                {employee.firstName}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {getSkillsComparison().map(({ skill, employees }) => (
                            <tr key={skill} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="py-2 font-medium">{skill}</td>
                              {selectedEmployeeData.map((employee) => (
                                <td key={employee.id} className="text-center py-2">
                                  {employee.skills.includes(skill) ? (
                                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto" />
                                  ) : (
                                    <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Skills Summary */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Skills Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedEmployeeData.map((employee) => (
                        <div
                          key={employee.id}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                            {employee.firstName} {employee.lastName}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {employee.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            {employee.skills.length} skills
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
} 