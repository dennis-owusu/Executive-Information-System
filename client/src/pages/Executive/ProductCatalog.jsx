import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { getProducts } from '../../services/api'
import { Link } from 'react-router-dom'

export default function ProductCatalog() {
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    const res = await getProducts({ q, limit: 24 })
    setProducts(res.items || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Input placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} />
          <Button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Search'}</Button>
        </div>
        <Link to="/executive/products/upload"><Button>Upload Product</Button></Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {products.map(p => (
          <Card key={p._id}>
            <CardContent className="space-y-2 p-4">
              <div className="font-medium">{p.name}</div>
              <div className="text-neutral-600">${p.price}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  )
}

