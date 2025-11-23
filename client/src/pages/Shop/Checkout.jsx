import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export default function Checkout() {
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input placeholder="Street" />
        <Input placeholder="City" />
      </div>
      <Button className="w-full sm:w-auto">Pay</Button>
    </motion.div>
  )
}
