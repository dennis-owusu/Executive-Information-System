import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { Link } from 'react-router-dom'

export default function Cart() {
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded border bg-white p-4">Your cart is empty</div>
      <Link to="/checkout"><Button>Checkout</Button></Link>
    </motion.div>
  )
}
