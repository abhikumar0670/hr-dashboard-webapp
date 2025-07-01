'use client'

import { motion } from 'framer-motion'
import { Card, CardProps } from './Card'
import { ReactNode } from 'react'

interface AnimatedCardProps extends Omit<CardProps, 'children'> {
  index?: number
  children: ReactNode
}

export function AnimatedCard({ children, index = 0, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  )
} 