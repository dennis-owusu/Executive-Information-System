import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getProducts } from '../../services/api.js'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Link } from 'react-router-dom'
import HeroBanner from '../../components/home/HeroBanner.jsx'
import CategorySidebar from '../../components/home/CategorySidebar.jsx'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')

  async function load() {
    const res = await getProducts({ q, limit: 24 })
    setProducts(res.items || [])
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <HeroBanner />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1"><CategorySidebar /></div>
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} />
            <Button onClick={load} className="w-full sm:w-auto">Search</Button>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
          >
            {products.map(p => (
              <Card key={p._id}>
                <CardContent className="space-y-2 p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-neutral-600">₵{p.price}</div>
                  <Link to={`/product/${p._id}`}><Button variant="outline" className="w-full">View</Button></Link>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
