import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadImage } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import ConfirmModal from '../components/ConfirmModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Fruits',
    image: '',
    stock: '',
    unit: ''
  });

  const categories = ['Fruits', 'Vegetables', 'Dairy & Eggs', 'Bakery', 'Meat & Seafood', 'Pantry', 'Snacks', 'Drinks'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock || 0,
        unit: product.unit || 'kg'
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Fruits',
        image: '',
        stock: 0,
        unit: 'kg'
      });
    }
    setIsModalOpen(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setIsUploading(true);
    try {
      const { data } = await uploadImage(uploadFormData);
      setFormData({ ...formData, image: data.image });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      showToast('Please upload an image first', 'error');
      return;
    }
    setIsSubmitting(true);
    
    // Convert to numbers and ensure rating is present
    const submitData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: editingProduct ? editingProduct.rating : 5 // Use existing rating or default to 5
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, submitData);
        showToast('Product updated successfully!');
      } else {
        await createProduct(submitData);
        showToast('Product created successfully!');
      }
      await fetchProducts();
      setTimeout(() => setIsModalOpen(false), 500);
    } catch (error) {
      console.error('Error saving product:', error);
      // Backend returns error in 'error' field
      const errorMsg = error.response?.data?.error || 'Error saving product. Check your data.';
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteProduct(deleteConfirm.id);
      showToast('Product deleted successfully!');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast('Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pb-10 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[200] px-6 py-3 rounded-2xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <ConfirmModal 
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove the item from your store permanently."
        confirmText="Yes, Delete Product"
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Products Management</h1>
          <p className="text-slate-500">Manage your store's inventory, pricing, and details.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
          <div className="relative w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
            Total: {filteredProducts.length}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-primary">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-8">Product</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock</th>
                  <th className="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="p-4 pl-8">
                        <div className="flex items-center gap-4">
                          <img 
                            src={getImageUrl(product.image)} 
                            alt={product.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">{product.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{product.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-black text-slate-900">${(product.price || 0).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          (product.stock > 0) ? 'bg-primary/10 text-primary border-primary/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}>
                          {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4 pr-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm({ show: true, id: product.id })}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-500 font-medium">
                      No products found. Add a new product to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Product Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass border border-slate-200 rounded-[2.5rem] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Image Upload UI */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {formData.image ? (
                      <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-300" size={32} />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 size={24} className="text-primary animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Product Image</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative group">
                        <input 
                          type="file" 
                          id="product-image"
                          className="hidden"
                          onChange={handleUpload}
                          accept="image/*"
                        />
                        <label 
                          htmlFor="product-image"
                          className="flex items-center justify-center gap-3 w-full bg-slate-100 border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 rounded-xl px-6 py-4 cursor-pointer transition-all"
                        >
                          <Plus size={20} className="text-slate-400 group-hover:text-primary" />
                          <span className="text-sm font-bold text-slate-500 group-hover:text-primary">
                            {formData.image ? 'Change Image' : 'Select Local Image'}
                          </span>
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Recommended: Square PNG/JPG, max 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all appearance-none [&>option]:bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all custom-scrollbar resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Stock Count</label>
                    <input 
                      type="number" 
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Unit (e.g. kg, lb, pcs)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-primary hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
