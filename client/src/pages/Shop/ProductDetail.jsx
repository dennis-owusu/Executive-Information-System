import React from 'react'
import { Button } from '../../components/ui/button'

export default function ProductDetail() {
  return (
    <div className="space-y-4">
      <div className="h-48 w-full rounded bg-neutral-200" />
      <div className="text-2xl font-bold">Product Title</div>
      <div className="text-neutral-600">$0.00</div>
      <Button>Add to Cart</Button>
    </div>
  )
}
