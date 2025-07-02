'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { departments, positions, skills as allSkills } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const { employees, setEmployees } = useStore()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    department: '',
    phone: '',
    address: '',
    bio: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.age) {
      newErrors.age = 'Age is required'
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 18 || Number(formData.age) > 65) {
      newErrors.age = 'Age must be between 18 and 65'
    }
    if (!formData.department) {
      newErrors.department = 'Department is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getRandomFromArray = (arr: any[], count = 1) => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const randomSkills = getRandomFromArray(allSkills, Math.floor(Math.random() * 4) + 2)
  const randomPosition = getRandomFromArray(positions, 1)[0]
  const randomPerformanceHistory = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
    date: new Date(2024 - i, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    review: 'Good performance with room for improvement in specific areas.'
  }))
  const randomProjects = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, i) => ({
    id: `proj-new-${Date.now()}-${i}`,
    name: `Project ${i + 1}`,
    progress: Math.floor(Math.random() * 100),
    status: ['active', 'completed', 'pending'][Math.floor(Math.random() * 3)]
  }))
  const randomGoals = Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, i) => ({
    id: `goal-new-${Date.now()}-${i}`,
    title: `Goal ${i + 1}`,
    description: 'Improve performance and achieve targets',
    targetDate: new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: ['pending', 'in-progress', 'completed'][Math.floor(Math.random() * 3)]
  }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const newEmployee = {
      id: Math.max(...employees.map(emp => emp.id)) + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      age: Number(formData.age),
      department: formData.department,
      performance: Number((Math.random() * 2 + 3).toFixed(1)),
      address: formData.address,
      phone: formData.phone,
      bio: formData.bio || 'Experienced professional with a strong track record in their field.',
      isBookmarked: false,
      status: 'active',
      salary: 500000,
      hireDate: new Date().toISOString().split('T')[0],
      managerId: undefined,
      position: randomPosition,
      skills: randomSkills,
      performanceHistory: randomPerformanceHistory,
      leaveBalance: 10,
      projects: randomProjects,
      goals: randomGoals,
      lastReviewDate: randomPerformanceHistory[0]?.date || '',
      nextReviewDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    }

    setEmployees([...employees, newEmployee])
    onClose()
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      age: '',
      department: '',
      phone: '',
      address: '',
      bio: '',
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-0 sm:p-4">
      <Card className="w-full h-full rounded-none p-0 flex flex-col sm:max-w-2xl sm:h-auto sm:rounded-lg sm:p-6">
        <CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 sm:static sm:p-0">
          <CardTitle className="text-lg sm:text-2xl">Add New Employee</CardTitle>
          <Button variant="outline" size="lg" onClick={onClose} className="py-3 px-4 text-lg rounded-xl">
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  className={`mt-1 block w-full rounded-md border ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <div className="sticky bottom-0 z-10 flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="py-3 px-4 text-lg rounded-xl">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} className="py-3 px-4 text-lg rounded-xl">Add Employee</Button>
        </div>
      </Card>
    </div>
  )
} 