'use client'

import { useEffect, useState } from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { useStore } from '@/store/useStore'
import {
  calculateAveragePerformance,
  calculateDepartmentPerformance,
  calculateSalaryMetrics,
  calculateTurnoverRate,
  calculateEmployeeRetention,
  getDepartmentDistribution,
  getSalaryDistribution,
  getPerformanceDistribution,
  formatCurrency,
  formatNumber,
  formatDate,
} from '@/lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
)

export default function AnalyticsPage() {
  const { employees } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for analytics
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  // Calculate metrics
  const totalEmployees = employees.length
  const activeEmployees = employees.filter(emp => emp.status === 'active').length
  const averagePerformance = calculateAveragePerformance(employees)
  const salaryMetrics = calculateSalaryMetrics(employees)
  const turnoverRate = calculateTurnoverRate(employees)
  const retentionRate = calculateEmployeeRetention(employees)

  // Chart data
  const departmentData = getDepartmentDistribution(employees)
  const salaryData = getSalaryDistribution(employees)
  const performanceData = getPerformanceDistribution(employees)

  // Department performance comparison
  const departmentPerformance = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = { total: 0, count: 0 }
    }
    acc[emp.department].total += emp.performance
    acc[emp.department].count += 1
      return acc
  }, {} as Record<string, { total: number; count: number }>)

  const departmentPerformanceData = {
    labels: Object.keys(departmentPerformance),
    datasets: [
      {
        label: 'Average Performance',
        data: Object.values(departmentPerformance).map(dept => dept.total / dept.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const departmentDistributionData = {
    labels: departmentData.map(d => d.department),
    datasets: [
      {
        data: departmentData.map(d => d.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(14, 165, 233, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const salaryDistributionData = {
    labels: salaryData.map(d => d.range),
    datasets: [
      {
        label: 'Number of Employees',
        data: salaryData.map(d => d.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  }

  const performanceDistributionData = {
    labels: performanceData.map(d => `${d.rating} Stars`),
    datasets: [
      {
        label: 'Number of Employees',
        data: performanceData.map(d => d.count),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  }

  // Performance trends over time
  const performanceTrends = employees.reduce((acc, emp) => {
    emp.performanceHistory.forEach(review => {
      const month = new Date(review.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!acc[month]) {
        acc[month] = { total: 0, count: 0 }
      }
      acc[month].total += review.rating
      acc[month].count += 1
    })
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const performanceTrendsData = {
    labels: Object.keys(performanceTrends).slice(-6), // Last 6 months
    datasets: [
      {
        label: 'Average Performance',
        data: Object.values(performanceTrends).slice(-6).map(month => month.total / month.count),
        borderColor: 'rgba(245, 158, 11, 1)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
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

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          HR Analytics Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Comprehensive insights into employee performance, salary distribution, and organizational metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard index={0}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalEmployees)}</div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees} active employees
            </p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard index={1}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePerformance.toFixed(1)}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard index={2}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(salaryMetrics.avg)}</div>
            <p className="text-xs text-muted-foreground">
              Median: {formatCurrency(salaryMetrics.median)}
            </p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard index={3}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retentionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Turnover rate: {turnoverRate}%
            </p>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard index={4}>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={departmentDistributionData} options={chartOptions} />
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard index={5}>
          <CardHeader>
            <CardTitle>Department Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={departmentPerformanceData} options={barChartOptions} />
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard index={6}>
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={salaryDistributionData} options={barChartOptions} />
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard index={7}>
          <CardHeader>
            <CardTitle>Performance Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={performanceDistributionData} options={barChartOptions} />
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Performance Trends */}
      <AnimatedCard index={8}>
        <CardHeader>
          <CardTitle>Performance Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Line data={performanceTrendsData} options={chartOptions} />
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedCard index={9}>
          <CardHeader>
            <CardTitle>Salary Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Minimum Salary:</span>
                <span className="font-medium">{formatCurrency(salaryMetrics.min)}</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Salary:</span>
                <span className="font-medium">{formatCurrency(salaryMetrics.max)}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Salary:</span>
                <span className="font-medium">{formatCurrency(salaryMetrics.avg)}</span>
              </div>
              <div className="flex justify-between">
                <span>Median Salary:</span>
                <span className="font-medium">{formatCurrency(salaryMetrics.median)}</span>
              </div>
              <div className="flex justify-between">
                <span>Salary Range:</span>
                <span className="font-medium">{formatCurrency(salaryMetrics.max - salaryMetrics.min)}</span>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard index={10}>
          <CardHeader>
            <CardTitle>Department Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={dept.department} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{dept.department}</span>
                    <div className="text-sm text-gray-500">
                      {dept.count} employees ({dept.percentage}%)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {calculateDepartmentPerformance(employees, dept.department).toFixed(1)}/5.0
                    </div>
                    <div className="text-sm text-gray-500">Avg Performance</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Employee Status Overview */}
      <AnimatedCard index={11}>
        <CardHeader>
          <CardTitle>Employee Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{activeEmployees}</div>
              <div className="text-sm text-gray-500">Active Employees</div>
              <div className="text-xs text-gray-400">
                {((activeEmployees / totalEmployees) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {employees.filter(emp => emp.status === 'inactive').length}
              </div>
              <div className="text-sm text-gray-500">Inactive Employees</div>
              <div className="text-xs text-gray-400">
                {((employees.filter(emp => emp.status === 'inactive').length / totalEmployees) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {employees.filter(emp => emp.status === 'on leave').length}
              </div>
              <div className="text-sm text-gray-500">On Leave Employees</div>
              <div className="text-xs text-gray-400">
                {((employees.filter(emp => emp.status === 'on leave').length / totalEmployees) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {employees.filter(emp => emp.status === 'terminated').length}
              </div>
              <div className="text-sm text-gray-500">Terminated Employees</div>
              <div className="text-xs text-gray-400">
                {((employees.filter(emp => emp.status === 'terminated').length / totalEmployees) * 100).toFixed(1)}% of total
              </div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  )
} 