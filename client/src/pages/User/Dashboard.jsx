import React from 'react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded border bg-white p-4">User dashboard</div>
    </motion.div>
  )
}
