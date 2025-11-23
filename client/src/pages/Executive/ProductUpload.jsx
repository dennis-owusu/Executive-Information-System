import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { createProduct } from '../../services/api'

export default function ProductUpload() {
  const [form, setForm] = useState({ name: '', description: '', price: '', categories: '', stock: '0', sku: '' })
  const [images, setImages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function onImages(e) {
    const files = Array.from(e.target.files).slice(0, 6)
    setImages(files)
  }

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    if (!form.name || !form.price) {
      setMessage('Name and price are required')
      return
    }
    setLoading(true)
    const data = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'categories') {
        const cats = String(v).split(',').map(s => s.trim()).filter(Boolean)
        if (cats.length) cats.forEach(c => data.append('categories', c))
      } else {
        data.append(k, v)
      }
    })
    images.forEach(f => data.append('images', f))
    try {
      await createProduct(data)
      setMessage('Product uploaded successfully')
      navigate('/executive')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" value={form.name} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={form.description} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input id="price" name="price" type="number" value={form.price} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categories">Categories (comma-separated)</Label>
              <Input id="categories" name="categories" value={form.categories} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" value={form.stock} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" value={form.sku} onChange={onChange} />
            </div>
            <div className="space-y-2">
              <Label>Images (up to 6, JPEG/PNG/WEBP)</Label>
              <Input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={onImages} />
              <div className="text-xs text-neutral-500">{images.length} selected</div>
            </div>
            {message && <div className="text-sm text-neutral-700">{message}</div>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Uploading...' : 'Upload Product'}</Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
