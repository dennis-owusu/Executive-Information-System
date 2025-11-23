import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-orange-600" />
          <span className="text-lg font-semibold">EIS Commerce</span>
        </Link>
        <div className="flex w-full max-w-xl items-center gap-2">
          <Input placeholder="Search products, suppliers and more" />
          <Button className="shrink-0">Search</Button>
        </div>
        <nav className="flex items-center gap-2">
          <Link to="/cart"><Button variant="outline">Cart</Button></Link>
          <Link to="/orders"><Button variant="outline">Orders</Button></Link>
          <Link to="/executive"><Button>Executive</Button></Link>
          <Link to="/login"><Button variant="ghost">Login</Button></Link>
        </nav>
      </div>
    </header>
  )
}
