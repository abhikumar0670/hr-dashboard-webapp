import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Employee = {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  department: string
  performance: number
  address: string
  phone: string
  bio: string
  isBookmarked: boolean
  salary: number
  hireDate: string
  managerId?: number
  position: string
  skills: string[]
  performanceHistory: { date: string; rating: number; review: string }[]
  leaveBalance: number
  projects: { id: string; name: string; progress: number; status: 'active' | 'completed' | 'pending' }[]
  goals: { id: string; title: string; description: string; targetDate: string; status: 'pending' | 'in-progress' | 'completed' }[]
  lastReviewDate?: string
  nextReviewDate?: string
  status: 'active' | 'inactive' | 'terminated' | 'on leave'
  statusHistory?: { date: string; oldStatus: string; newStatus: string; reason?: string }[]
  promotionHistory?: { date: string; oldPosition: string; newPosition: string; reason?: string }[]
}

export type Department = {
  id: string
  name: string
  managerId?: number
  budget: number
  employeeCount: number
}

export type PerformanceReview = {
  id: string
  employeeId: number
  reviewerId: number
  date: string
  rating: number
  comments: string
  goals: string[]
  improvements: string[]
}

// Leave management types
export interface LeaveRequest {
  id: string
  employeeId: number
  employeeName: string
  leaveType: 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity' | 'work-from-home'
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  approvedBy?: string
  approvedAt?: string
  comments?: string
  totalDays: number
}

export interface LeaveBalance {
  employeeId: number
  sick: number
  casual: number
  annual: number
  maternity: number
  paternity: number
  workFromHome: number
}

type Notification = {
  id: string
  date: string
  employeeId: number
  employeeName: string
  oldStatus: string
  newStatus: string
  reason?: string
  read: boolean
  type?: 'status' | 'promotion' | 'project' | 'goal'
}

type Store = {
  employees: Employee[]
  departments: Department[]
  performanceReviews: PerformanceReview[]
  bookmarkedEmployees: Employee[]
  searchQuery: string
  departmentFilter: string[]
  performanceFilter: number[]
  salaryRangeFilter: [number, number]
  selectedEmployees: number[]
  positionFilter: string[]
  statusFilter: string[]
  hireDateFilter: { start: string; end: string }
  skillsFilter: string[]
  leaveRequests: LeaveRequest[]
  leaveBalances: LeaveBalance[]
  notifications: Notification[]
  setEmployees: (employees: Employee[]) => void
  setDepartments: (departments: Department[]) => void
  setPerformanceReviews: (reviews: PerformanceReview[]) => void
  toggleBookmark: (employeeId: number) => void
  setSearchQuery: (query: string) => void
  setDepartmentFilter: (departments: string[]) => void
  setPerformanceFilter: (ratings: number[]) => void
  setSalaryRangeFilter: (range: [number, number]) => void
  setSelectedEmployees: (ids: number[]) => void
  setPositionFilter: (positions: string[]) => void
  setStatusFilter: (statuses: string[]) => void
  setHireDateFilter: (dates: { start: string; end: string }) => void
  setSkillsFilter: (skills: string[]) => void
  promoteEmployee: (employeeId: number, newPosition: string, reason?: string) => void
  bulkPromoteEmployees: (employeeIds: number[]) => void
  updateEmployee: (employeeId: number, updates: Partial<Employee>) => void
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  deleteEmployee: (employeeId: number) => void
  addPerformanceReview: (review: Omit<PerformanceReview, 'id'>) => void
  updateEmployeeSalary: (employeeId: number, newSalary: number) => void
  updateEmployeeStatus: (employeeId: number, status: Employee['status'], reason?: string) => void
  assignManager: (employeeId: number, managerId: number) => void
  addEmployeeGoal: (employeeId: number, goal: Employee['goals'][0]) => void
  updateGoalStatus: (employeeId: number, goalId: string, status: Employee['goals'][0]['status']) => void
  updateProjectStatus: (employeeId: number, projectId: string, status: 'active' | 'completed' | 'pending', progress: number) => void
  addEmployeeProject: (employeeId: number, project: Employee['projects'][0]) => void
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'submittedAt' | 'status'>) => void
  approveLeaveRequest: (requestId: string, approvedBy: string, comments?: string) => void
  rejectLeaveRequest: (requestId: string, approvedBy: string, comments?: string) => void
  updateLeaveBalance: (employeeId: number, leaveType: string, daysUsed: number) => void
  initializeLeaveBalances: (employees: any[]) => void
  getLeaveBalance: (employeeId: number) => LeaveBalance | undefined
  getEmployeeLeaveRequests: (employeeId: number) => LeaveRequest[]
  getPendingLeaveRequests: () => LeaveRequest[]
  updateEmployeeStatusesForLeave: () => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  removeNotification: (id: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      employees: [],
      departments: [],
      performanceReviews: [],
      bookmarkedEmployees: [],
      searchQuery: '',
      departmentFilter: [],
      performanceFilter: [],
      salaryRangeFilter: [0, 1000000],
      selectedEmployees: [],
      positionFilter: [],
      statusFilter: [],
      hireDateFilter: { start: '', end: '' },
      skillsFilter: [],
      leaveRequests: [],
      leaveBalances: [],
      notifications: [],
      
      setEmployees: (employees) => set({ employees }),
      setDepartments: (departments) => set({ departments }),
      setPerformanceReviews: (reviews) => set({ performanceReviews: reviews }),
      
      toggleBookmark: (employeeId) =>
        set((state) => {
          const updatedEmployees = state.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, isBookmarked: !emp.isBookmarked }
              : emp
          )
          const bookmarkedEmployees = updatedEmployees.filter(
            (emp) => emp.isBookmarked
          )
          return { employees: updatedEmployees, bookmarkedEmployees }
        }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setDepartmentFilter: (departments) => set({ departmentFilter: departments }),
      setPerformanceFilter: (ratings) => set({ performanceFilter: ratings }),
      setSalaryRangeFilter: (range) => set({ salaryRangeFilter: range }),
      setSelectedEmployees: (ids) => set({ selectedEmployees: ids }),
      setPositionFilter: (positions) => set({ positionFilter: positions }),
      setStatusFilter: (statuses) => set({ statusFilter: statuses }),
      setHireDateFilter: (dates) => set({ hireDateFilter: dates }),
      setSkillsFilter: (skills) => set({ skillsFilter: skills }),
      
      promoteEmployee: (employeeId, newPosition, reason) => {
        const employee = get().employees.find(emp => emp.id === employeeId)
        if (!employee) return
        set((state) => ({
          employees: state.employees.map((emp) => {
            if (emp.id !== employeeId) return emp
            const oldPosition = emp.position
            const history = emp.promotionHistory || []
            return {
              ...emp,
              position: newPosition,
              promotionHistory: [
                ...history,
                {
                  date: new Date().toISOString(),
                  oldPosition,
                  newPosition,
                  reason: reason || '',
                },
              ],
            }
          }),
          notifications: [
            {
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(),
              employeeId: employeeId,
              employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
              oldStatus: '',
              newStatus: '',
              reason: `Promoted to ${newPosition}${reason ? ': ' + reason : ''}`,
              read: false,
            },
            ...state.notifications,
          ],
        }))
      },
      
      bulkPromoteEmployees: (employeeIds) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            employeeIds.includes(emp.id)
              ? { ...emp, performance: Math.min(5, emp.performance + 0.5) }
              : emp
          ),
        })),
      
      updateEmployee: (employeeId, updates) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId ? { ...emp, ...updates } : emp
          ),
        })),
      
      addEmployee: (employee) =>
        set((state) => ({
          employees: [...state.employees, { ...employee, id: Date.now() }],
        })),
      
      deleteEmployee: (employeeId) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== employeeId),
        })),
      
      addPerformanceReview: (review) =>
        set((state) => ({
          performanceReviews: [...state.performanceReviews, { ...review, id: Date.now().toString() }],
        })),
      
      updateEmployeeSalary: (employeeId, newSalary) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId ? { ...emp, salary: newSalary } : emp
          ),
        })),
      
      updateEmployeeStatus: (employeeId, status, reason) => {
        const employee = get().employees.find(emp => emp.id === employeeId)
        set((state) => ({
          employees: state.employees.map((emp) => {
            if (emp.id !== employeeId) return emp
            const oldStatus = emp.status
            if (oldStatus === status) return emp
            const history = emp.statusHistory || []
            return {
              ...emp,
              status,
              statusHistory: [
                ...history,
                {
                  date: new Date().toISOString(),
                  oldStatus,
                  newStatus: status,
                  reason: reason || '',
                },
              ],
            }
          }),
          notifications: [
            {
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(),
              employeeId: employeeId,
              employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
              oldStatus: employee ? employee.status : '',
              newStatus: status,
              reason: reason || '',
              read: false,
            },
            ...state.notifications,
          ],
        }))
      },
      
      assignManager: (employeeId, managerId) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId ? { ...emp, managerId } : emp
          ),
        })),
      
      addEmployeeGoal: (employeeId, goal) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, goals: [...emp.goals, { ...goal, id: Date.now().toString() }] }
              : emp
          ),
        })),
      
      updateGoalStatus: (employeeId, goalId, status) => {
        const employee = get().employees.find(emp => emp.id === employeeId)
        if (!employee) return
        
        const goal = employee.goals.find(g => g.id === goalId)
        if (!goal) return
        
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId
              ? {
                  ...emp,
                  goals: emp.goals.map((goal) =>
                    goal.id === goalId ? { ...goal, status } : goal
                  ),
                }
              : emp
          ),
          notifications: [
            {
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(),
              employeeId: employeeId,
              employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
              oldStatus: goal.status,
              newStatus: status,
              reason: `Goal "${goal.title}" status updated to ${status}`,
              read: false,
            },
            ...state.notifications,
          ],
        }))
      },
      
      updateProjectStatus: (employeeId, projectId, status, progress) => {
        const employee = get().employees.find(emp => emp.id === employeeId)
        if (!employee) return
        
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId
              ? {
                  ...emp,
                  projects: emp.projects.map((project) => {
                    if (project.id === projectId) {
                      const oldStatus = project.status
                      const oldProgress = project.progress
                      // If status changes from completed to pending, adjust progress
                      let newProgress = progress
                      if (oldStatus === 'completed' && status === 'pending') {
                        newProgress = Math.min(progress, 80) // Cap at 80% when reverting
                      } else if (status === 'completed') {
                        newProgress = 100 // Always 100% when completed
                      }
                      return { ...project, status, progress: newProgress }
                    }
                    return project
                  }),
                }
              : emp
          ),
          notifications: [
            {
              id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(),
              employeeId: employeeId,
              employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
              oldStatus: '',
              newStatus: '',
              reason: `Project status updated to ${status} (${progress}% complete)`,
              read: false,
            },
            ...state.notifications,
          ],
        }))
      },
      
      addEmployeeProject: (employeeId, project) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, projects: [...emp.projects, project] }
              : emp
          ),
        })),
      
      submitLeaveRequest: (request) => {
        const newRequest: LeaveRequest = {
          ...request,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          status: 'pending'
        }
        set((state) => ({
          leaveRequests: [...state.leaveRequests, newRequest]
        }))
      },
      
      approveLeaveRequest: (requestId, approvedBy, comments) => {
        set((state) => ({
          leaveRequests: state.leaveRequests.map(request => 
            request.id === requestId 
              ? { 
                  ...request, 
                  status: 'approved', 
                  approvedBy, 
                  approvedAt: new Date().toISOString(),
                  comments 
                }
              : request
          )
        }))
        
        // Update leave balance
        const request = get().leaveRequests.find(r => r.id === requestId)
        if (request) {
          get().updateLeaveBalance(request.employeeId, request.leaveType, request.totalDays)
        }
      },
      
      rejectLeaveRequest: (requestId, approvedBy, comments) => {
        set((state) => ({
          leaveRequests: state.leaveRequests.map(request => 
            request.id === requestId 
              ? { 
                  ...request, 
                  status: 'rejected', 
                  approvedBy, 
                  approvedAt: new Date().toISOString(),
                  comments 
                }
              : request
          )
        }))
      },
      
      updateLeaveBalance: (employeeId, leaveType, daysUsed) => {
        set((state) => ({
          leaveBalances: state.leaveBalances.map(balance => 
            balance.employeeId === employeeId
              ? { ...balance, [leaveType]: Math.max(0, balance[leaveType as keyof LeaveBalance] - daysUsed) }
              : balance
          )
        }))
      },
      
      initializeLeaveBalances: (employees) => {
        const balances: LeaveBalance[] = employees.map(emp => ({
          employeeId: emp.id,
          sick: 12,
          casual: 10,
          annual: 21,
          maternity: 26,
          paternity: 15,
          workFromHome: 30
        }))
        set({ leaveBalances: balances })
      },
      
      getLeaveBalance: (employeeId) => {
        return get().leaveBalances.find(balance => balance.employeeId === employeeId)
      },
      
      getEmployeeLeaveRequests: (employeeId) => {
        return get().leaveRequests.filter(request => request.employeeId === employeeId)
      },
      
      getPendingLeaveRequests: () => {
        return get().leaveRequests.filter(request => request.status === 'pending')
      },
      
      updateEmployeeStatusesForLeave: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const updatedEmployees = state.employees.map(emp => {
            if (emp.status !== 'on leave') return emp;
            // Find the most recent approved leave for this employee
            const leaves = state.leaveRequests
              .filter(lr => lr.employeeId === emp.id && lr.status === 'approved')
              .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
            if (leaves.length === 0) return emp;
            const mostRecentLeave = leaves[0];
            if (mostRecentLeave.endDate < today) {
              // Leave has ended, set status to active
              const history = emp.statusHistory || [];
              return {
                ...emp,
                status: 'active',
                statusHistory: [
                  ...history,
                  {
                    date: today,
                    oldStatus: emp.status,
                    newStatus: 'active',
                    reason: 'Leave ended',
                  },
                ],
              };
            }
            return emp;
          });
          return { employees: updatedEmployees };
        });
      },
      
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        })),
      clearNotifications: () => set({ notifications: [] }),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
    }),
    {
      name: 'hr-dashboard-storage',
      version: 3,
    }
  )
) 