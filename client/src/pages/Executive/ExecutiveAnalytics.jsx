import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '../../components/ui/card'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { getSalesSummary } from '../../services/api'

export default function ExecutiveAnalytics() {
  const [sales, setSales] = useState({ series: [] })
  useEffect(() => { getSalesSummary({ granularity: 'day' }).then(setSales).catch(() => {}) }, [])
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-bold">Product Analytics</h2>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-neutral-600">Daily Revenue</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sales.series}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#FF6A00" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

