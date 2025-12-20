import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Upload, Image as ImageIcon, Plus, Trash2, 
    XCircle, Check, DollarSign, Package, Layers, FileText 
} from 'lucide-react';
import { createProduct, updateProduct, getProducts } from '../../services/api';
import { cn } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';

// Common product categories
const COMMON_CATEGORIES = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 
    'Toys & Games', 'Health & Beauty', 'Automotive', 'Food & Beverages', 'Office Supplies'
];

export default function AddProductForm({ onClose, onSuccess, editingProduct = null }) {
    const { showSuccess, showError } = useNotifications();
    const modalRef = useRef(null);
    
    // State
    const [formValues, setFormValues] = useState({
        name: editingProduct?.name || '',
        description: editingProduct?.description || '',
        price: editingProduct?.price ? String(editingProduct.price) : '',
        stock: editingProduct?.stock ? String(editingProduct.stock) : '0',
        categories: editingProduct?.categories || [],
        customCategory: '',
        images: []
    });

    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([...COMMON_CATEGORIES]);
    const [isDragging, setIsDragging] = useState(false);

    // --- Effects ---

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && !saving) onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose, saving]);

    useEffect(() => {
        // Load existing categories to auto-complete suggestions
        const loadCategories = async () => {
            try {
                const data = await getProducts({ limit: 100 });
                const allCategories = new Set(COMMON_CATEGORIES);
                data.items?.forEach(product => {
                    product.categories?.forEach(cat => allCategories.add(cat));
                });
                setAvailableCategories(Array.from(allCategories).sort());
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        loadCategories();
    }, []);

    // --- Handlers ---

    const validateForm = (values) => {
        const errors = {};
        if (!values.name?.trim()) errors.name = 'Product name is required';
        
        const priceNumber = Number(values.price);
        if (!values.price || Number.isNaN(priceNumber) || priceNumber <= 0) {
            errors.price = 'Price must be greater than 0';
        }
        
        const stockNumber = Number(values.stock);
        if (values.stock === '' || Number.isNaN(stockNumber) || stockNumber < 0) {
            errors.stock = 'Invalid quantity';
        }
        
        if (values.images && values.images.length > 6) {
            errors.images = 'Max 6 images allowed';
        }
        
        return errors;
    };

    const handleFormChange = (field, value) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // --- Category Logic ---

    const toggleCategory = (category) => {
        setFormValues(prev => {
            const current = prev.categories || [];
            if (current.includes(category)) {
                return { ...prev, categories: current.filter(c => c !== category) };
            }
            return { ...prev, categories: [...current, category] };
        });
    };

    const addCustomCategory = () => {
        const category = formValues.customCategory.trim();
        if (category && !formValues.categories.includes(category)) {
            setFormValues(prev => ({
                ...prev,
                categories: [...(prev.categories || []), category],
                customCategory: ''
            }));
            if (!availableCategories.includes(category)) {
                setAvailableCategories(prev => [...prev, category].sort());
            }
        }
    };

    // --- Image Logic (Drag & Drop + Input) ---

    const processFiles = (files) => {
        const fileArray = Array.from(files);
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        
        const validFiles = fileArray.filter(file => {
            return allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
        });

        if (validFiles.length !== fileArray.length) {
            setFormErrors(prev => ({ ...prev, images: 'Some files were rejected (Invalid type or > 5MB)' }));
        }

        const combined = [...formValues.images, ...validFiles].slice(0, 6);
        setFormValues(prev => ({ ...prev, images: combined }));

        // Generate Previews
        Promise.all(combined.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve({ file, preview: e.target.result });
                reader.readAsDataURL(file);
            });
        })).then(previews => setImagePreviews(previews));
    };

    const handleFileChange = (e) => processFiles(e.target.files || []);
    
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const removeImage = (index) => {
        const newImages = formValues.images.filter((_, i) => i !== index);
        setFormValues(prev => ({ ...prev, images: newImages }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // --- Submission ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm(formValues);
        setFormErrors(errors);
        
        if (Object.keys(errors).length > 0) return;

        setSaving(true);
        const formData = new FormData();
        formData.append('name', formValues.name.trim());
        if (formValues.description) formData.append('description', formValues.description.trim());
        formData.append('price', formValues.price);
        formData.append('stock', formValues.stock || '0');
        
        const categories = formValues.categories.length > 0 ? formValues.categories : ['General'];
        categories.forEach(cat => formData.append('categories', cat));
        formValues.images.forEach(file => formData.append('images', file));

        try {
            let result;
            if (editingProduct) {
                result = await updateProduct(editingProduct._id, formData);
                showSuccess('Updated', 'Product details updated successfully');
            } else {
                result = await createProduct(formData);
                showSuccess('Created', 'New product added to catalog');
            }
            if (onSuccess) onSuccess({ type: 'success', product: result });
            onClose();
        } catch (error) {
            showError('Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div 
                ref={modalRef}
                className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                role="dialog"
                aria-modal="true"
            >
                {/* --- Header --- */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingProduct ? 'Edit Product' : 'New Product'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {editingProduct ? 'Update product details and inventory' : 'Add a new item to your inventory'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* --- Scrollable Content --- */}
                <div className="overflow-y-auto flex-1 bg-gray-50/50">
                    <form id="product-form" onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* === LEFT COLUMN: MAIN INFO === */}
                            <div className="lg:col-span-2 space-y-6">
                                
                                {/* General Information Card */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                    <div className="flex items-center gap-2 mb-2 text-gray-900 font-semibold">
                                        <FileText size={18} className="text-blue-600" />
                                        <h3>General Information</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                value={formValues.name}
                                                onChange={(e) => handleFormChange('name', e.target.value)}
                                                className={cn(
                                                    "w-full px-4 py-2.5 rounded-lg border bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none",
                                                    formErrors.name ? "border-red-300 focus:border-red-500" : "border-gray-200"
                                                )}
                                                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                                            />
                                            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={formValues.description}
                                                onChange={(e) => handleFormChange('description', e.target.value)}
                                                rows={5}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                                                placeholder="Write a compelling description..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Media / Images Card */}
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                                            <ImageIcon size={18} className="text-blue-600" />
                                            <h3>Product Media</h3>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">
                                            {formValues.images.length} / 6 images
                                        </span>
                                    </div>

                                    {/* Drag & Drop Zone */}
                                    <div 
                                        className={cn(
                                            "relative border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out text-center p-8",
                                            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50",
                                            formErrors.images && "border-red-300 bg-red-50"
                                        )}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            multiple
                                            accept="image/png, image/jpeg, image/webp"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex flex-col items-center pointer-events-none">
                                            <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                                                <Upload size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Click or drag images here
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG or WEBP (max 5MB)
                                            </p>
                                        </div>
                                    </div>
                                    {formErrors.images && <p className="mt-2 text-xs text-center text-red-500">{formErrors.images}</p>}

                                    {/* Image Preview Grid */}
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
                                            {imagePreviews.map((preview, idx) => (
                                                <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                                    <img src={preview.preview} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {formValues.images.length < 6 && (
                                                <label htmlFor="file-upload" className="flex items-center justify-center aspect-square rounded-lg border border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all text-gray-400 hover:text-blue-500">
                                                    <Plus size={24} />
                                                </label>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* === RIGHT COLUMN: SIDEBAR === */}
                            <div className="space-y-6">
                                
                                {/* Pricing Card */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                                        <DollarSign size={18} className="text-blue-600" />
                                        <h3>Pricing</h3>
                                    </div>
                                    
                                    <div className="relative">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Base Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formValues.price}
                                                onChange={(e) => handleFormChange('price', e.target.value)}
                                                className={cn(
                                                    "w-full pl-7 pr-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                                                    formErrors.price ? "border-red-300" : "border-gray-200"
                                                )}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
                                    </div>
                                </div>

                                {/* Inventory Card */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                                        <Package size={18} className="text-blue-600" />
                                        <h3>Inventory</h3>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Quantity in Stock</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={formValues.stock}
                                            onChange={(e) => handleFormChange('stock', e.target.value)}
                                            className={cn(
                                                "w-full px-4 py-2 rounded-lg border bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all",
                                                formErrors.stock ? "border-red-300" : "border-gray-200"
                                            )}
                                        />
                                        {formErrors.stock && <p className="mt-1 text-xs text-red-500">{formErrors.stock}</p>}
                                    </div>
                                </div>

                                {/* Organization / Categories Card */}
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                                        <Layers size={18} className="text-blue-600" />
                                        <h3>Organization</h3>
                                    </div>

                                    {/* Active Tags */}
                                    <div className="mb-4">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Selected Categories</label>
                                        <div className="flex flex-wrap gap-2 min-h-[32px]">
                                            {formValues.categories.length === 0 && (
                                                <span className="text-sm text-gray-400 italic">No categories selected</span>
                                            )}
                                            {formValues.categories.map(cat => (
                                                <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-md border border-blue-100">
                                                    {cat}
                                                    <button type="button" onClick={() => toggleCategory(cat)} className="hover:text-blue-900">
                                                        <XCircle size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add Custom */}
                                    <div className="flex gap-2 mb-4">
                                        <input 
                                            type="text"
                                            value={formValues.customCategory}
                                            onChange={(e) => handleFormChange('customCategory', e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCategory())}
                                            placeholder="Add custom category..."
                                            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={addCustomCategory}
                                            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {/* Suggestions */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Quick Add</label>
                                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                            {availableCategories.filter(c => !formValues.categories.includes(c)).map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => toggleCategory(cat)}
                                                    className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all text-left"
                                                >
                                                    + {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>

                {/* --- Footer / Actions --- */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    >
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Check size={16} />
                        )}
                        {editingProduct ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </div>
        </div>
    );
}
