'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ChartBarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  PlusIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'

interface ProjectStats {
  total: number
  active: number
  completed: number
  pending: number
  completionRate: number
}

interface GoalStats {
  total: number
  inProgress: number
  completed: number
  pending: number
  achievementRate: number
}

interface AllProject {
  id: string
  name: string
  employeeId: number
  employeeName: string
  progress: number
  status: 'active' | 'completed' | 'pending'
}

interface AllGoal {
  id: string
  title: string
  employeeId: number
  employeeName: string
  status: 'pending' | 'in-progress' | 'completed'
  targetDate: string
  description: string
}

export default function ProjectsPage() {
  const { employees, updateProjectStatus, addEmployeeGoal, addEmployeeProject, updateGoalStatus } = useStore()
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null)
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', progress: 0, status: 'active' as const })
  const [newGoal, setNewGoal] = useState({ 
    title: '', 
    description: '', 
    targetDate: '', 
    status: 'pending' as const 
  })

  // Calculate project statistics
  const getProjectStats = (): ProjectStats => {
    const allProjects = employees.flatMap(emp => 
      emp.projects.map(project => ({ ...project, employeeId: emp.id }))
    )
    
    const active = allProjects.filter(p => p.status === 'active').length
    const completed = allProjects.filter(p => p.status === 'completed').length
    const pending = allProjects.filter(p => p.status === 'pending').length
    const total = allProjects.length
    
    return {
      total,
      active,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  // Calculate goal statistics
  const getGoalStats = (): GoalStats => {
    const allGoals = employees.flatMap(emp => 
      emp.goals.map(goal => ({ ...goal, employeeId: emp.id }))
    )
    
    const inProgress = allGoals.filter(g => g.status === 'in-progress').length
    const completed = allGoals.filter(g => g.status === 'completed').length
    const pending = allGoals.filter(g => g.status === 'pending').length
    const total = allGoals.length
    
    return {
      total,
      inProgress,
      completed,
      pending,
      achievementRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  // Get all projects with employee info
  const getAllProjects = (): AllProject[] => {
    return employees.flatMap(emp => 
      emp.projects.map(project => ({
        ...project,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`
      }))
    )
  }

  // Get all goals with employee info
  const getAllGoals = (): AllGoal[] => {
    return employees.flatMap(emp => 
      emp.goals.map(goal => ({
        ...goal,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`
      }))
    )
  }

  const projectStats = getProjectStats()
  const goalStats = getGoalStats()
  const allProjects = getAllProjects()
  const allGoals = getAllGoals()

  const handleAddProject = () => {
    if (!selectedEmployee || !newProject.name) return
    
    const employee = employees.find(emp => emp.id === selectedEmployee)
    if (!employee) return

    const projectData = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newProject.name,
      progress: newProject.progress,
      status: newProject.status
    }

    addEmployeeProject(selectedEmployee, projectData)
    setNewProject({ name: '', progress: 0, status: 'active' })
    setIsAddProjectModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleAddGoal = () => {
    if (!selectedEmployee || !newGoal.title) return
    
    const goalData = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: newGoal.title,
      description: newGoal.description,
      targetDate: newGoal.targetDate,
      status: newGoal.status
    }

    addEmployeeGoal(selectedEmployee, goalData)
    setNewGoal({ title: '', description: '', targetDate: '', status: 'pending' })
    setIsAddGoalModalOpen(false)
    setSelectedEmployee(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'active':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Project & Goal Tracking Dashboard
          </h1>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Projects</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{projectStats.total}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-blue-600">Active: {projectStats.active}</span>
                    <span className="text-green-600">Done: {projectStats.completed}</span>
                  </div>
                </div>
                <BriefcaseIcon className="h-12 w-12 text-blue-600 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-300">Total Goals</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{goalStats.total}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-blue-600">Active: {goalStats.inProgress}</span>
                    <span className="text-green-600">Done: {goalStats.completed}</span>
                  </div>
                </div>
                <CheckCircleIcon className="h-12 w-12 text-green-600 dark:text-green-300" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-300">Project Completion</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{projectStats.completionRate}%</p>
                </div>
                <ArrowTrendingUpIcon className="h-12 w-12 text-purple-600 dark:text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Goal Achievement</p>
                  <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{goalStats.achievementRate}%</p>
                </div>
                <CheckCircleIcon className="h-12 w-12 text-indigo-600 dark:text-indigo-300" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Assign Projects & Goals Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserGroupIcon className="h-6 w-6" />
              Assign Projects & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Employee
              </label>
              <select
                value={selectedEmployee || ''}
                onChange={(e) => setSelectedEmployee(e.target.value ? Number(e.target.value) : null)}
                className="w-full md:w-96 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
              >
                <option value="">Choose an employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} - {emp.department}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setIsAddProjectModalOpen(true)}
                disabled={!selectedEmployee}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Project
              </Button>
              <Button
                onClick={() => setIsAddGoalModalOpen(true)}
                disabled={!selectedEmployee}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Projects */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseIcon className="h-6 w-6" />
              All Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allProjects.map((project) => (
                <div key={`${project.employeeId}-${project.id}`} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <BriefcaseIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{project.employeeName}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{project.name}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            project.status === 'completed' ? 'bg-green-600' :
                            project.status === 'active' ? 'bg-blue-600' : 'bg-yellow-600'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{project.progress}% complete</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                    <select
                      value={project.status}
                      onChange={(e) => updateProjectStatus(
                        project.employeeId, 
                        project.id, 
                        e.target.value as 'active' | 'completed' | 'pending',
                        project.progress
                      )}
                      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Goals */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircleIcon className="h-6 w-6" />
              All Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allGoals.map((goal) => (
                <div key={`${goal.employeeId}-${goal.id}`} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{goal.employeeName}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{goal.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{goal.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        Target: {formatDate(goal.targetDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {goal.status}
                    </span>
                    <select
                      value={goal.status}
                      onChange={(e) => updateGoalStatus(
                        goal.employeeId, 
                        goal.id, 
                        e.target.value as 'pending' | 'in-progress' | 'completed'
                      )}
                      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Project</h3>
              <button
                onClick={() => setIsAddProjectModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Progress
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProject.progress}
                  onChange={(e) => setNewProject(prev => ({ ...prev, progress: Number(e.target.value) }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProject}
                  className="flex-1"
                >
                  Add Project
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Goal</h3>
              <button
                onClick={() => setIsAddGoalModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  placeholder="Enter goal title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Enter goal description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddGoal}
                  className="flex-1"
                >
                  Add Goal
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
