import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import KpiCard from '../../components/common/KpiCard.jsx'
import { Button } from '../../components/ui/button'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { getSalesSummary, getOperationsSummary } from '../../services/api.js'

export default function ExecutiveDashboard() {
  const [sales, setSales] = useState({ series: [], total: { total: 0, count: 0 } })
  const [ops, setOps] = useState({ avgFulfillmentHours: 0, cancelled: 0, refunded: 0, paymentSuccessRate: 0 })

  useEffect(() => {
    getSalesSummary({ granularity: 'day' }).then(setSales).catch(() => {})
    getOperationsSummary().then(setOps).catch(() => {})
  }, [])

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex">
        <Link to="/executive/products/upload"><Button variant="outline" className="w-full sm:w-auto ml-auto">Upload Product</Button></Link>
      </div>
      <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.05 }}>
        <KpiCard title="Total Revenue" value={sales.total.total.toFixed(2)} />
        <KpiCard title="Total Orders" value={sales.total.count} />
        <KpiCard title="Avg Fulfillment (h)" value={ops.avgFulfillmentHours.toFixed(1)} />
        <KpiCard title="Payment Success" value={(ops.paymentSuccessRate * 100).toFixed(1) + '%'} />
      </motion.div>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-neutral-600">Revenue Trend</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sales.series}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#FF6A00" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
