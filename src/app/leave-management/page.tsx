'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon, 
  CalendarIcon,
  FunnelIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const leaveTypeColors = {
  sick: 'bg-red-100 text-red-800',
  casual: 'bg-blue-100 text-blue-800',
  annual: 'bg-green-100 text-green-800',
  maternity: 'bg-pink-100 text-pink-800',
  paternity: 'bg-purple-100 text-purple-800',
  'work-from-home': 'bg-gray-100 text-gray-800',
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const statusIcons = {
  pending: ClockIcon,
  approved: CheckIcon,
  rejected: XMarkIcon,
}

export default function LeaveManagementPage() {
  const { 
    leaveRequests, 
    employees, 
    approveLeaveRequest, 
    rejectLeaveRequest,
    initializeLeaveBalances,
    updateEmployeeStatusesForLeave
  } = useStore()
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [approvalComment, setApprovalComment] = useState('')

  // Initialize leave balances when employees are loaded
  useEffect(() => {
    if (employees.length > 0) {
      initializeLeaveBalances(employees)
    }
  }, [employees.length, initializeLeaveBalances])

  // Automatically update employee statuses after leave ends
  useEffect(() => {
    updateEmployeeStatusesForLeave();
  }, [leaveRequests]);

  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesType = leaveTypeFilter === 'all' || request.leaveType === leaveTypeFilter
    const matchesSearch = request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  })

  // Sort filteredRequests by submittedAt (newest first)
  const sortedRequests = [...filteredRequests].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const pendingCount = leaveRequests.filter(r => r.status === 'pending').length
  const approvedCount = leaveRequests.filter(r => r.status === 'approved').length
  const rejectedCount = leaveRequests.filter(r => r.status === 'rejected').length

  const handleApprove = (requestId: string) => {
    approveLeaveRequest(requestId, 'HR Manager', approvalComment)
    setApprovalComment('')
    setSelectedRequest(null)
  }

  const handleReject = (requestId: string) => {
    rejectLeaveRequest(requestId, 'HR Manager', approvalComment)
    setApprovalComment('')
    setSelectedRequest(null)
  }

  const getEmployeeDetails = (employeeId: number) => {
    return employees.find(emp => emp.id === employeeId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Leave Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage employee leave requests and approvals
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{leaveRequests.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-white">{pendingCount}</p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Approved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-white">{approvedCount}</p>
              </div>
              <CheckIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-200">Rejected</p>
                <p className="text-2xl font-bold text-red-600 dark:text-white">{rejectedCount}</p>
              </div>
              <XMarkIcon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <FunnelIcon className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Leave Type</label>
              <select
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="all">All Types</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
                <option value="work-from-home">Work From Home</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by employee name or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setStatusFilter('all')
                  setLeaveTypeFilter('all')
                  setSearchQuery('')
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Requests List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Leave Requests ({filteredRequests.length})
        </h2>
        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {sortedRequests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-64 flex-col items-center justify-center text-center"
              >
                <CalendarIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  No leave requests found
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or search criteria
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {sortedRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6 dark:bg-gray-800">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* Employee Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {request.employeeName}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaveTypeColors[request.leaveType]}`}>
                                {request.leaveType.replace('-', ' ').toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                                {request.status.toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-200">
                              <div>
                                <span className="font-medium">Date Range:</span><br />
                                {formatDate(request.startDate)} - {formatDate(request.endDate)}
                              </div>
                              <div>
                                <span className="font-medium">Total Days:</span><br />
                                {request.totalDays} days
                              </div>
                              <div>
                                <span className="font-medium">Submitted:</span><br />
                                {formatDate(request.submittedAt)}
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <span className="font-medium text-gray-700 dark:text-gray-200">Reason:</span>
                              <p className="text-gray-600 dark:text-gray-200 mt-1">{request.reason}</p>
                            </div>

                            {request.comments && (
                              <div className="mt-3">
                                <span className="font-medium text-gray-700 dark:text-gray-200">HR Comments:</span>
                                <p className="text-gray-600 dark:text-gray-200 mt-1">{request.comments}</p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 lg:flex-shrink-0">
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  onClick={() => setSelectedRequest(request.id)}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  Review
                                </Button>
                              </>
                            )}
                            
                            {request.status !== 'pending' && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approvedBy}
                                <br />
                                {request.approvedAt && formatDate(request.approvedAt)}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Approval Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Review Leave Request</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                rows={3}
                placeholder="Add any comments for the employee..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => handleApprove(selectedRequest)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleReject(selectedRequest)}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => {
                  setSelectedRequest(null)
                  setApprovalComment('')
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 