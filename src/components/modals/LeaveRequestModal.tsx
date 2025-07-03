'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useStore } from '@/store/useStore'
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface LeaveRequestModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  employeeName: string
}

const leaveTypes = [
  { value: 'sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800' },
  { value: 'casual', label: 'Casual Leave', color: 'bg-blue-100 text-blue-800' },
  { value: 'annual', label: 'Annual Leave', color: 'bg-green-100 text-green-800' },
  { value: 'maternity', label: 'Maternity Leave', color: 'bg-pink-100 text-pink-800' },
  { value: 'paternity', label: 'Paternity Leave', color: 'bg-purple-100 text-purple-800' },
  { value: 'work-from-home', label: 'Work From Home', color: 'bg-gray-100 text-gray-800' },
]

export function LeaveRequestModal({ isOpen, onClose, employeeId, employeeName }: LeaveRequestModalProps) {
  const { submitLeaveRequest, getLeaveBalance } = useStore()
  const [formData, setFormData] = useState({
    leaveType: 'casual' as const,
    startDate: '',
    endDate: '',
    reason: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null);

  const leaveBalance = getLeaveBalance(employeeId)

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required'
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past'
      }
      
      if (end < start) {
        newErrors.endDate = 'End date must be after start date'
      }
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required'
    }
    
    // Check leave balance
    const daysRequested = calculateDays()
    if (leaveBalance) {
      const availableDays = leaveBalance[formData.leaveType as keyof typeof leaveBalance] || 0
      if (daysRequested > availableDays) {
        newErrors.leaveType = `Insufficient ${leaveTypes.find(lt => lt.value === formData.leaveType)?.label} balance. Available: ${availableDays} days`
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const totalDays = calculateDays()
    
    submitLeaveRequest({
      employeeId,
      employeeName,
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      totalDays
    })
    
    // Reset form
    setFormData({
      leaveType: 'casual',
      startDate: '',
      endDate: '',
      reason: ''
    })
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setFormData({
      leaveType: 'casual',
      startDate: '',
      endDate: '',
      reason: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogContent className="w-full h-full rounded-none p-0 flex flex-col sm:max-w-lg sm:h-auto sm:rounded-lg sm:p-6">
        <DialogHeader className="sticky top-0 z-10 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 sm:static sm:p-0">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-2xl">
            <CalendarIcon className="h-6 w-6" />
            Request Leave
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </DialogHeader>
        
        {/* Scrollable Content */}
        <div className="flex-1 min-h-0 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6 p-4 sm:p-0">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Requesting leave for: <span className="font-semibold">{employeeName}</span></p>
            </CardContent>
          </Card>

          {/* Leave Balance */}
          {leaveBalance && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leave Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(leaveBalance).map(([type, balance]) => {
                    if (type === 'employeeId') return null
                    const leaveType = leaveTypes.find(lt => lt.value === type)
                    return (
                      <div key={type} className="text-center p-3 rounded-lg bg-gray-50">
                        <div className="text-sm text-gray-600">{leaveType?.label}</div>
                        <div className="text-xl font-bold text-gray-900">{balance}</div>
                        <div className="text-xs text-gray-500">days remaining</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leave Request Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Leave Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {leaveTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, leaveType: type.value as any }))}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      formData.leaveType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${type.color}`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
              {errors.leaveType && (
                <p className="mt-1 text-sm text-red-600">{errors.leaveType}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Days Calculation */}
            {formData.startDate && formData.endDate && (
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <span className="font-medium">Total days requested:</span> {calculateDays()} days
                </p>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={4}
                placeholder="Please provide a detailed reason for your leave request..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300"
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>
          </form>
        </div>
        
        {/* Footer - always visible */}
        <div className="sticky bottom-0 z-10 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="py-3 px-4 text-lg rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => formRef.current && formRef.current.requestSubmit()}
            className="py-3 px-4 text-lg rounded-xl"
          >
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 