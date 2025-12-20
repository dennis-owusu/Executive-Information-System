import React, { useEffect, useState } from 'react'
import { createProduct, getAllCategories, uploadImage } from '../../services/api'
import { X, Upload, Image as ImageIcon, DollarSign, Package, Tag, Star, AlertCircle, Info, Trash2, Eye, Plus, Check } from 'lucide-react'

export default function ProductForm({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    productName: '',
    category: '',
    productImage: '',
    productPrice: '',
    numberOfProductsAvailable: '',
    description: '',
    specifications: '',
    featured: false,
    discountPrice: '',
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [specInput, setSpecInput] = useState('')
  const [specsList, setSpecsList] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    if (!open) return
    const load = async () => {
      try {
        const data = await getAllCategories()
        setCategories(data.allCategory || [])
      } catch (e) {
        setCategories([])
      }
    }
    load()
  }, [open])

  function updateField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, GIF)')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB')
      return
    }

    setUploadingImage(true)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    try {
      // Upload image to server
      const uploadResponse = await uploadImage(file)
      if (uploadResponse.success && uploadResponse.images && uploadResponse.images.length > 0) {
        const imageUrl = uploadResponse.images[0].filePath
        setForm(prev => ({ ...prev, productImage: imageUrl }))
        console.log('Image uploaded successfully:', imageUrl)
      } else {
        throw new Error('Image upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      setError('Failed to upload image. Please try again.')
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    updateField('productImage', '')
  }

  const addSpecification = () => {
    if (specInput.trim()) {
      const newSpecs = [...specsList, specInput.trim()]
      setSpecsList(newSpecs)
      updateField('specifications', newSpecs.join(', '))
      setSpecInput('')
    }
  }

  const removeSpecification = (index) => {
    const newSpecs = specsList.filter((_, i) => i !== index)
    setSpecsList(newSpecs)
    updateField('specifications', newSpecs.join(', '))
  }

  const validateForm = () => {
    const errors = {}
    if (!form.productName.trim()) errors.productName = 'Product name is required'
    if (!form.productPrice || Number(form.productPrice) <= 0) errors.productPrice = 'Valid price is required'
    if (!form.category) errors.category = 'Category is required'
    if (!form.productImage && !imagePreview) errors.productImage = 'Product image is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) {
      setError('Please fix the errors below')
      return
    }

    const outletUser = JSON.parse(localStorage.getItem('user') || '{}')
    const outletId = outletUser?._id || outletUser?.id
    
    const payload = {
      productName: form.productName,
      category: form.category,
      productImage: form.productImage, // This is now a URL from the upload
      productPrice: Number(form.productPrice),
      numberOfProductsAvailable: Number(form.numberOfProductsAvailable || 0),
      description: form.description || '',
      specifications: specsList,
      featured: !!form.featured,
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      outlet: outletId
    }
    
    try {
      setLoading(true)
      const res = await createProduct(payload)
      setLoading(false)
      if (res?.success) {
        onCreated?.(res.product)
        onClose?.()
        resetForm()
      } else {
        setError(res?.message || 'Failed to create product')
      }
    } catch (e) {
      setLoading(false)
      setError(e?.response?.data?.message || e.message || 'Failed to create product')
    }
  }

  const resetForm = () => {
    setForm({
      productName: '',
      category: '',
      productImage: '',
      productPrice: '',
      numberOfProductsAvailable: '',
      description: '',
      specifications: '',
      featured: false,
      discountPrice: '',
    })
    setSpecsList([])
    setImagePreview(null)
    setFormErrors({})
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900/70 via-purple-900/30 to-blue-900/20 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl w-full max-w-4xl border-2 border-purple-100 shadow-2xl shadow-purple-500/10 max-h-[95vh] overflow-hidden">
        {/* Vibrant Header */}
        <div className="relative p-6 border-b border-purple-100 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-orange-500/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">✨ Add New Product</h2>
                <p className="text-white/80 text-sm">Fill in the details to add a product to your store</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Colorful Tab Navigation */}
        <div className="px-6 pt-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'basic'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 border border-gray-200'
              }`}
            >
              <Package className="w-4 h-4" />
              Basic Info
              {activeTab === 'basic' && <Check className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'advanced'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 border border-gray-200'
              }`}
            >
              <Star className="w-4 h-4" />
              Advanced Details
              {activeTab === 'advanced' && <Check className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 animate-fadeIn">
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">Attention Required</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="p-6">
            {activeTab === 'basic' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Product Details */}
                <div className="space-y-6">
                  {/* Product Name - Green Card */}
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formErrors.productName 
                      ? 'border-red-300 bg-red-50/50' 
                      : 'border-green-200 bg-gradient-to-br from-green-50/80 to-emerald-50/50'
                  }`}>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                      <div className="p-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={form.productName}
                      onChange={e => updateField('productName', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                        formErrors.productName
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-green-100 focus:border-green-400 focus:ring-green-500/20'
                      } focus:ring-4 focus:outline-none placeholder:text-gray-400 bg-white`}
                      placeholder="Enter product name"
                    />
                    {formErrors.productName && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.productName}
                      </p>
                    )}
                  </div>

                  {/* Category - Purple Card */}
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formErrors.category 
                      ? 'border-red-300 bg-red-50/50' 
                      : 'border-purple-200 bg-gradient-to-br from-purple-50/80 to-violet-50/50'
                  }`}>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                      <div className="p-1.5 bg-gradient-to-r from-purple-400 to-violet-500 rounded-lg">
                        <Tag className="w-4 h-4 text-white" />
                      </div>
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={e => updateField('category', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                        formErrors.category
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-purple-100 focus:border-purple-400 focus:ring-purple-500/20'
                      } focus:ring-4 focus:outline-none appearance-none bg-white`}
                    >
                      <option value="" className="text-gray-400">Select a category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id} className="text-gray-700">
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Image & Pricing */}
                <div className="space-y-6">
                  {/* Image Upload - Blue Card */}
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formErrors.productImage 
                      ? 'border-red-300 bg-red-50/50' 
                      : 'border-blue-200 bg-gradient-to-br from-blue-50/80 to-cyan-50/50'
                  }`}>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                      <div className="p-1.5 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg">
                        <ImageIcon className="w-4 h-4 text-white" />
                      </div>
                      Product Image *
                    </label>
                    
                    {/* Upload Area */}
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300 bg-white/50">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full">
                            <Upload className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Drop your image here, or click to browse</p>
                            <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, GIF • Max: 5MB</p>
                          </div>
                          <input
                            type="file"
                            onChange={handleImageUpload}
                            accept="image/*"
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 cursor-pointer shadow-md shadow-blue-500/25"
                          >
                            {uploadingImage ? 'Uploading...' : 'Browse Files'}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border-2 border-blue-200">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => document.getElementById('image-upload').click()}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
                          >
                            <Eye className="w-4 h-4 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="p-2 bg-red-500/20 backdrop-blur-sm rounded-lg hover:bg-red-500/30 transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                          Image Preview
                        </div>
                      </div>
                    )}
                    {formErrors.productImage && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.productImage}
                      </p>
                    )}
                  </div>

                  {/* Pricing - Orange Card */}
                  <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formErrors.productPrice 
                      ? 'border-red-300 bg-red-50/50' 
                      : 'border-orange-200 bg-gradient-to-br from-orange-50/80 to-yellow-50/50'
                  }`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                          <div className="p-1.5 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          Regular Price *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.productPrice}
                            onChange={e => updateField('productPrice', e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all duration-300 ${
                              formErrors.productPrice
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-orange-100 focus:border-orange-400 focus:ring-orange-500/20'
                            } focus:ring-4 focus:outline-none bg-white`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                          <div className="p-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg">
                            <Tag className="w-4 h-4 text-white" />
                          </div>
                          Discount Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.discountPrice}
                            onChange={e => updateField('discountPrice', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-yellow-100 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-500/20 focus:outline-none transition-all duration-300 bg-white"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                    {formErrors.productPrice && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.productPrice}
                      </p>
                    )}
                  </div>

                  {/* Stock & Featured */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-blue-50/50">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                        <div className="p-1.5 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-lg">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={form.numberOfProductsAvailable}
                        onChange={e => updateField('numberOfProductsAvailable', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border-2 border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all duration-300 bg-white"
                        placeholder="Enter quantity"
                      />
                    </div>

                    {/* Featured Toggle - Pink Card */}
                    <div className="p-4 rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50/80 to-rose-50/50">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                        <div className="p-1.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-lg">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        Featured Product
                      </label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{form.featured ? 'Yes, featured' : 'No, not featured'}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.featured}
                            onChange={e => updateField('featured', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-14 h-7 bg-gradient-to-r from-gray-300 to-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r from-pink-500 to-rose-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Description - Teal Card */}
                <div className="p-4 rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50/80 to-emerald-50/50">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <div className="p-1.5 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg">
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={e => updateField('description', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-teal-100 focus:border-teal-400 focus:ring-4 focus:ring-teal-500/20 focus:outline-none transition-all duration-300 resize-none placeholder:text-gray-400 bg-white"
                    rows={4}
                    placeholder="Describe your product features, benefits, and unique selling points..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Share what makes your product special</p>
                    <span className="text-xs text-teal-600 font-medium">{form.description.length}/1000 characters</span>
                  </div>
                </div>

                {/* Specifications - Multi-color Card */}
                <div className="p-4 rounded-xl border-2 border-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-blue-50/50">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                    <div className="p-1.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 rounded-lg">
                      <Tag className="w-4 h-4 text-white" />
                    </div>
                    Specifications
                  </label>
                  
                  {/* Add Specification Input */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={specInput}
                      onChange={(e) => setSpecInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecification())}
                      className="flex-1 px-4 py-3 rounded-lg border-2 border-purple-100 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 bg-white"
                      placeholder="Add a specification (e.g., Color: Black)"
                    />
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md shadow-purple-500/25 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  {/* Specifications List */}
                  {specsList.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600">Added Specifications</span>
                        <span className="text-xs text-purple-600 font-bold">{specsList.length} items</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {specsList.map((spec, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all duration-300"
                          >
                            <span className="text-sm text-gray-700">{spec}</span>
                            <button
                              type="button"
                              onClick={() => removeSpecification(index)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Colorful Footer */}
          <div className="sticky bottom-0 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50/80 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium">Fields marked with <span className="text-red-500">*</span> are required</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}