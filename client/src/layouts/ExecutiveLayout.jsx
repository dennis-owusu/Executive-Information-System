import React from 'react'
import { motion } from 'framer-motion'
import { NavLink, Outlet } from 'react-router-dom'

const nav = [
  { to: '/executive', label: 'Overview' },
  { to: '/executive/products', label: 'Products' },
  { to: '/executive/products/upload', label: 'Upload' },
  { to: '/executive/analytics', label: 'Analytics' },
  { to: '/executive/orders', label: 'Orders' }
]

export default function ExecutiveLayout() {
  return (
    <motion.div className="grid grid-cols-1 gap-6 lg:grid-cols-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <aside className="lg:col-span-1">
        <nav className="rounded-lg border bg-white p-4">
          <div className="mb-2 text-sm font-semibold text-neutral-700">Executive Navigation</div>
          <ul className="space-y-1">
            {nav.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded px-3 py-2 text-sm ${isActive ? 'bg-orange-600 text-white' : 'hover:bg-neutral-100'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="lg:col-span-3">
        <Outlet />
      </main>
    </motion.div>
  )
}
