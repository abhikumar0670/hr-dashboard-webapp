'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { useStore } from '@/store/useStore'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

interface PerformanceReviewModalProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  employeeName: string
}

export function PerformanceReviewModal({
  isOpen,
  onClose,
  employeeId,
  employeeName,
}: PerformanceReviewModalProps) {
  const { addPerformanceReview } = useStore()
  const [rating, setRating] = useState(3)
  const [comments, setComments] = useState('')
  const [goals, setGoals] = useState([''])
  const [improvements, setImprovements] = useState([''])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!comments.trim()) {
      alert('Please provide comments for the review')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    addPerformanceReview({
      employeeId,
      reviewerId: 1, // Current user ID
      date: new Date().toISOString().split('T')[0],
      rating,
      comments: comments.trim(),
      goals: goals.filter(goal => goal.trim()),
      improvements: improvements.filter(improvement => improvement.trim()),
    })

    setIsSubmitting(false)
    handleClose()
  }

  const handleClose = () => {
    setRating(3)
    setComments('')
    setGoals([''])
    setImprovements([''])
    onClose()
  }

  const addGoal = () => {
    setGoals([...goals, ''])
  }

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index))
  }

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals]
    newGoals[index] = value
    setGoals(newGoals)
  }

  const addImprovement = () => {
    setImprovements([...improvements, ''])
  }

  const removeImprovement = (index: number) => {
    setImprovements(improvements.filter((_, i) => i !== index))
  }

  const updateImprovement = (index: number, value: string) => {
    const newImprovements = [...improvements]
    newImprovements[index] = value
    setImprovements(newImprovements)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 w-full h-full rounded-none p-0 flex flex-col shadow-xl sm:max-w-4xl sm:h-auto sm:rounded-lg sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                Performance Review
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review for {employeeName}
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={handleClose}
              className="py-3 px-4 text-lg rounded-xl"
            >
              ✕
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[70vh] p-4 sm:p-6 custom-scrollbar">
            <div className="space-y-6">
              {/* Rating Section */}
              <AnimatedCard index={0}>
                <CardHeader>
                  <CardTitle>Performance Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          {star <= rating ? (
                            <StarSolidIcon className="h-8 w-8 text-yellow-400" />
                          ) : (
                            <StarIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div>
                      <span className="text-2xl font-bold">{rating}/5</span>
                      <p className="text-sm text-gray-500">
                        {rating === 1 && 'Needs Improvement'}
                        {rating === 2 && 'Below Average'}
                        {rating === 3 && 'Meets Expectations'}
                        {rating === 4 && 'Exceeds Expectations'}
                        {rating === 5 && 'Outstanding'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Comments Section */}
              <AnimatedCard index={1}>
                <CardHeader>
                  <CardTitle>Review Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide detailed feedback about the employee's performance, achievements, and areas for improvement..."
                    className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </CardContent>
              </AnimatedCard>

              {/* Goals Section */}
              <AnimatedCard index={2}>
                <CardHeader>
                  <CardTitle>Goals & Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={goal}
                          onChange={(e) => updateGoal(index, e.target.value)}
                          placeholder="Enter a specific goal or objective..."
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {goals.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeGoal(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addGoal}
                      className="w-full"
                    >
                      + Add Goal
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Improvements Section */}
              <AnimatedCard index={3}>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={improvement}
                          onChange={(e) => updateImprovement(index, e.target.value)}
                          placeholder="Enter an area for improvement..."
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {improvements.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeImprovement(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addImprovement}
                      className="w-full"
                    >
                      + Add Improvement Area
                    </Button>
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="py-3 px-4 text-lg rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !comments.trim()}
              className="flex items-center gap-2 py-3 px-4 text-lg rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 