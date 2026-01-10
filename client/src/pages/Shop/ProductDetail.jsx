import React from 'react'
import { Button } from '../../components/ui/button'

export default function ProductDetail() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="h-48 w-full rounded bg-neutral-200 sm:h-64 md:h-80" />
      <div className="space-y-4">
        <div className="text-2xl font-bold">Product Title</div>
        <div className="text-neutral-600">₵0.00</div>
        <Button className="w-full sm:w-auto">Add to Cart</Button>
      </div>
    </div>
  )
}
