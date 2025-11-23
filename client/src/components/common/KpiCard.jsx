import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

export default function KpiCard({ title, value, hint }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-neutral-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hint && <div className="text-xs text-neutral-500">{hint}</div>}
      </CardContent>
    </Card>
  )
}
