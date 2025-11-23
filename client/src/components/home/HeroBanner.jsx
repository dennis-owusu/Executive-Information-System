import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'

export default function HeroBanner() {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 to-amber-500 text-white"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="p-8">
        <motion.h1
          className="text-2xl font-bold md:text-3xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Source the best products at wholesale prices
        </motion.h1>
        <motion.p
          className="mt-2 max-w-xl text-white/90"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Discover top suppliers and trending items across categories. Trusted by executives and professionals.
        </motion.p>
        <motion.div
          className="mt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button className="bg-white text-orange-600 hover:bg-white/90">Explore Now</Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
