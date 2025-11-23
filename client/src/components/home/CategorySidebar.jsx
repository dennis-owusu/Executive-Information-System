import React from 'react'
import { motion } from 'framer-motion'

const categories = [
  'Consumer Electronics', 'Apparel', 'Beauty & Personal Care', 'Home & Garden', 'Sports & Outdoors', 'Automobiles & Motorcycles', 'Packaging & Printing', 'Machinery'
]

export default function CategorySidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border bg-white p-4"
    >
      <div className="mb-2 text-sm font-semibold text-neutral-700">Browse by Category</div>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c} className="cursor-pointer text-sm text-neutral-700 hover:text-orange-600">
            {c}
          </li>
        ))}
      </ul>
    </motion.aside>
  )
}
