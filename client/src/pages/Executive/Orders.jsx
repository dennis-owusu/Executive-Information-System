import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../../components/ui/card'

export default function Orders() {
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-bold">Orders</h2>
      <Card>
        <CardContent className="p-4">Order analytics and list will appear here.</CardContent>
      </Card>
    </motion.div>
  )
}

