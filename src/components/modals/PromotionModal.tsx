import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { positions } from '@/lib/utils'
import { useStore } from '@/store/useStore'

interface PromotionModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  employeeName: string
  currentPosition: string
}

export function PromotionModal({ isOpen, onClose, employeeId, employeeName, currentPosition }: PromotionModalProps) {
  const { promoteEmployee } = useStore()
  const [newPosition, setNewPosition] = useState(currentPosition)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPosition || newPosition === currentPosition) return
    setIsSubmitting(true)
    await new Promise(res => setTimeout(res, 500))
    promoteEmployee(employeeId, newPosition, reason)
    setIsSubmitting(false)
    setReason('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-full rounded-none p-0 flex flex-col sm:max-w-md sm:h-auto sm:rounded-lg sm:p-6">
        <DialogHeader className="sticky top-0 z-10 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 sm:static sm:p-0">
          <DialogTitle className="text-lg sm:text-2xl">Promote Employee</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 sm:p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
              <div className="font-semibold text-gray-900 dark:text-white">{employeeName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Position</label>
              <div className="text-gray-600 dark:text-gray-300">{currentPosition}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Position</label>
              <select
                value={newPosition}
                onChange={e => setNewPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                {positions.map(pos => (
                  <option key={pos} value={pos} disabled={pos === currentPosition}>{pos}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                placeholder="Enter reason for promotion..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
          </form>
        </div>
        <div className="sticky bottom-0 z-10 flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="py-3 px-4 text-lg rounded-xl">Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || !newPosition || newPosition === currentPosition} className="py-3 px-4 text-lg rounded-xl">
            {isSubmitting ? 'Promoting...' : 'Promote'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 