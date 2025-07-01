import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function generatePerformanceHistory() {
  const months = 12
  const history = []
  const today = new Date()

  for (let i = 0; i < months; i++) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)
    history.push({
      date: date.toISOString(),
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3 and 5
    })
  }

  return history.reverse()
}

export const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Product',
  'Design',
  'Customer Support',
  'Legal',
] as const

export const positions = [
  'Software Engineer',
  'Senior Software Engineer',
  'Lead Engineer',
  'Engineering Manager',
  'Product Manager',
  'Marketing Manager',
  'Sales Representative',
  'Sales Manager',
  'HR Specialist',
  'HR Manager',
  'Financial Analyst',
  'Finance Manager',
  'Operations Manager',
  'Designer',
  'Senior Designer',
  'Customer Support Specialist',
  'Legal Counsel',
  'CEO',
  'CTO',
  'CFO',
]

export const skills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'SQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Machine Learning',
  'Data Analysis',
  'Project Management',
  'Leadership',
  'Communication',
  'Sales',
  'Marketing',
  'Design',
  'Finance',
  'Legal',
  'Customer Service',
]

export const getDepartmentColor = (department: string) => {
  const colors = {
    Engineering: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Marketing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    Sales: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'Human Resources': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    Finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Operations: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    Product: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    Design: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'Customer Support': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    Legal: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  }
  return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

export const getPositionColor = (position: string) => {
  const colors = {
    'Software Engineer': 'bg-blue-100 text-blue-800',
    'Senior Software Engineer': 'bg-blue-200 text-blue-900',
    'Lead Engineer': 'bg-indigo-100 text-indigo-800',
    'Engineering Manager': 'bg-indigo-200 text-indigo-900',
    'Product Manager': 'bg-purple-100 text-purple-800',
    'Marketing Manager': 'bg-pink-100 text-pink-800',
    'Sales Representative': 'bg-green-100 text-green-800',
    'Sales Manager': 'bg-green-200 text-green-900',
    'HR Specialist': 'bg-yellow-100 text-yellow-800',
    'HR Manager': 'bg-yellow-200 text-yellow-900',
    'Financial Analyst': 'bg-orange-100 text-orange-800',
    'Finance Manager': 'bg-orange-200 text-orange-900',
    'Operations Manager': 'bg-teal-100 text-teal-800',
    'Designer': 'bg-red-100 text-red-800',
    'Senior Designer': 'bg-red-200 text-red-900',
    'Customer Support Specialist': 'bg-gray-100 text-gray-800',
    'Legal Counsel': 'bg-gray-200 text-gray-900',
    'CEO': 'bg-black text-white',
    'CTO': 'bg-gray-800 text-white',
    'CFO': 'bg-gray-700 text-white',
  }
  return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    inactive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    terminated: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    'on leave': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export const getGoalStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export const getProjectStatusColor = (status: string) => {
  const colors = {
    active: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

// Performance calculation utilities
export const calculateAveragePerformance = (employees: any[]) => {
  if (employees.length === 0) return 0
  const total = employees.reduce((sum, emp) => sum + emp.performance, 0)
  return Number((total / employees.length).toFixed(1))
}

export const calculateDepartmentPerformance = (employees: any[], department: string) => {
  const deptEmployees = employees.filter(emp => emp.department === department)
  return calculateAveragePerformance(deptEmployees)
}

export const calculateSalaryMetrics = (employees: any[]) => {
  if (employees.length === 0) return { min: 0, max: 0, avg: 0, median: 0 }
  
  const salaries = employees.map(emp => emp.salary).sort((a, b) => a - b)
  const min = salaries[0]
  const max = salaries[salaries.length - 1]
  const avg = Number((salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length).toFixed(0))
  const median = salaries.length % 2 === 0 
    ? (salaries[salaries.length / 2 - 1] + salaries[salaries.length / 2]) / 2
    : salaries[Math.floor(salaries.length / 2)]
  
  return { min, max, avg, median }
}

export const calculateTurnoverRate = (employees: any[], timePeriod: 'month' | 'quarter' | 'year' = 'year') => {
  const now = new Date()
  const terminatedEmployees = employees.filter(emp => emp.status === 'terminated')
  
  if (timePeriod === 'month') {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const recentTerminations = terminatedEmployees.filter(emp => new Date(emp.terminationDate || '') >= lastMonth)
    return Number(((recentTerminations.length / employees.length) * 100).toFixed(2))
  }
  
  return Number(((terminatedEmployees.length / employees.length) * 100).toFixed(2))
}

export const calculateEmployeeRetention = (employees: any[]) => {
  const activeEmployees = employees.filter(emp => emp.status === 'active')
  const longTermEmployees = activeEmployees.filter(emp => {
    const hireDate = new Date(emp.hireDate)
    const yearsEmployed = (new Date().getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    return yearsEmployed >= 2
  })
  
  return Number(((longTermEmployees.length / activeEmployees.length) * 100).toFixed(1))
}

// Date utilities
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

export const getYearsOfService = (hireDate: string) => {
  const hire = new Date(hireDate)
  const now = new Date()
  const years = now.getFullYear() - hire.getFullYear()
  const months = now.getMonth() - hire.getMonth()
  
  if (months < 0) {
    return years - 1
  }
  return years
}

// Filter utilities
export const filterEmployees = (
  employees: any[],
  filters: {
    searchQuery: string
    departmentFilter: string[]
    performanceFilter: number[]
    salaryRangeFilter: [number, number]
    positionFilter: string[]
    statusFilter: string[]
    hireDateFilter: { start: string; end: string }
    skillsFilter: string[]
  }
) => {
  return employees.filter((employee) => {
    // Search query
    const matchesSearch =
      filters.searchQuery === '' ||
      employee.firstName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(filters.searchQuery.toLowerCase())

    // Department filter
    const matchesDepartment =
      filters.departmentFilter.length === 0 ||
      filters.departmentFilter.includes(employee.department)

    // Performance filter
    const matchesPerformance =
      filters.performanceFilter.length === 0 ||
      filters.performanceFilter.includes(Math.floor(employee.performance))

    // Salary range filter
    const matchesSalary =
      employee.salary >= filters.salaryRangeFilter[0] &&
      employee.salary <= filters.salaryRangeFilter[1]

    // Position filter
    const matchesPosition =
      filters.positionFilter.length === 0 ||
      filters.positionFilter.includes(employee.position)

    // Status filter
    const matchesStatus =
      filters.statusFilter.length === 0 ||
      filters.statusFilter.includes(employee.status)

    // Hire date filter
    const matchesHireDate =
      !filters.hireDateFilter.start ||
      !filters.hireDateFilter.end ||
      (new Date(employee.hireDate) >= new Date(filters.hireDateFilter.start) &&
       new Date(employee.hireDate) <= new Date(filters.hireDateFilter.end))

    // Skills filter
    const matchesSkills =
      filters.skillsFilter.length === 0 ||
      filters.skillsFilter.some(skill => employee.skills.includes(skill))

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
}

// Export utilities
export const exportToCSV = (employees: any[]) => {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Department',
    'Position',
    'Salary',
    'Performance',
    'Hire Date',
    'Status',
    'Phone',
    'Address',
  ]

  const csvContent = [
    headers.join(','),
    ...employees.map(emp => [
      emp.id,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.department,
      emp.position,
      emp.salary,
      emp.performance,
      emp.hireDate,
      emp.status,
      emp.phone,
      emp.address,
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

// Chart data utilities
export const getDepartmentDistribution = (employees: any[]) => {
  const distribution = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(distribution).map(([department, count]) => ({
    department,
    count,
    percentage: Number(((count / employees.length) * 100).toFixed(1)),
  }))
}

export const getSalaryDistribution = (employees: any[]) => {
  const ranges = [
    { min: 0, max: 500000, label: '0-5L' },
    { min: 500000, max: 1000000, label: '5L-10L' },
    { min: 1000000, max: 2000000, label: '10L-20L' },
    { min: 2000000, max: 5000000, label: '20L-50L' },
    { min: 5000000, max: Infinity, label: '50L+' },
  ]

  return ranges.map(range => ({
    range: range.label,
    count: employees.filter(emp => emp.salary >= range.min && emp.salary < range.max).length,
  }))
}

export const getPerformanceDistribution = (employees: any[]) => {
  const distribution = employees.reduce((acc, emp) => {
    const rating = Math.floor(emp.performance)
    acc[rating] = (acc[rating] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  return Object.entries(distribution).map(([rating, count]) => ({
    rating: Number(rating),
    count,
    percentage: Number(((count / employees.length) * 100).toFixed(1)),
  }))
} 