import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-2 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-orange-600" />
            <span className="text-lg font-semibold">EIS Commerce</span>
          </Link>
          <div className="flex items-center gap-2 sm:order-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm sm:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(o => !o)}
            >
              Menu
            </button>
            <nav className="hidden items-center gap-2 sm:flex">
              <Link to="/cart"><Button variant="outline">Cart</Button></Link>
              <Link to="/orders"><Button variant="outline">Orders</Button></Link>
              <Link to="/executive"><Button>Executive</Button></Link>
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
            </nav>
          </div>
          <div className="order-3 sm:order-none">
            <div className="flex w-full max-w-xl items-center gap-2">
              <Input placeholder="Search products, suppliers and more" />
              <Button className="shrink-0">Search</Button>
            </div>
          </div>
          {open && (
            <div id="mobile-nav" className="sm:hidden">
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link to="/cart"><Button variant="outline" className="w-full">Cart</Button></Link>
                <Link to="/orders"><Button variant="outline" className="w-full">Orders</Button></Link>
                <Link to="/executive"><Button className="w-full">Executive</Button></Link>
                <Link to="/login"><Button variant="ghost" className="w-full">Login</Button></Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
