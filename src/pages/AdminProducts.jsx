
import React, { useState, useRef } from 'react';
import { useApp } from '../App.jsx';
import { Plus, Search, Edit2, Trash2, ExternalLink, ArrowLeft, Sparkles, Loader2, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProducts = () => {
  const { products, setProducts } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Accessories',
    image: '',
    stock: 0,
    featured: false
  });

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: 0, category: 'Accessories', image: '', stock: 0, featured: false });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
      toast.success('Product updated successfully!');
    } else {
      const newProduct = { ...formData, id: Date.now().toString() };
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product added successfully!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast.success('Product deleted successfully!');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="container py-5">
      <button onClick={() => navigate('/admin')} className="btn btn-link text-muted p-0 mb-4 text-decoration-none">
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5">
        <div>
          <h1 className="h2 fw-bold mb-0">Inventory</h1>
          <p className="text-muted mb-0">Update and manage your product catalog</p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group" style={{ width: '250px' }}>
            <span className="input-group-text bg-white border-end-0 border-light"><Search size={16} /></span>
            <input 
              type="text" 
              className="form-control border-start-0 py-2 shadow-none border-light" 
              placeholder="Filter..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={() => openModal()} className="btn btn-dark px-4 fw-bold d-flex align-items-center gap-2 rounded-3 shadow">
            <Plus size={20} /> Add Product
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase fw-bold">
                <th className="px-4 py-3 border-0">Product</th>
                <th className="px-4 py-3 border-0">Stock</th>
                <th className="px-4 py-3 border-0">Price</th>
                <th className="px-4 py-3 border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={product.image || 'https://via.placeholder.com/48'} className="rounded-3 border object-fit-cover bg-light" style={{ width: '48px', height: '48px' }} alt="" />
                      <div>
                        <div className="fw-bold text-dark">{product.name}</div>
                        <div className="small text-muted">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`fw-bold ${product.stock < 10 ? 'text-danger' : 'text-dark'}`}>{product.stock} units</span>
                  </td>
                  <td className="px-4 py-3 fw-bold">${product.price}</td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <Link to={`/product/${product.id}`} className="btn btn-sm btn-light p-2 border"><ExternalLink size={16} /></Link>
                      <button onClick={() => openModal(product)} className="btn btn-sm btn-light p-2 border"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(product)} className="btn btn-sm btn-light p-2 text-danger border"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom-0 p-4">
                <h5 className="modal-title fw-bold fs-4">{editingProduct ? 'Edit' : 'Add'} Product</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmit} className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Name</label>
                    <input name="name" className="form-control py-2 shadow-none border-light rounded-3 bg-light" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Category</label>
                    <select name="category" className="form-select py-2 shadow-none border-light rounded-3 bg-light" value={formData.category} onChange={handleInputChange}>
                      <option>Accessories</option><option>Apparel</option><option>Beauty</option><option>Home</option><option>Tech</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Price ($)</label>
                    <input type="number" name="price" className="form-control py-2 shadow-none border-light rounded-3 bg-light" value={formData.price} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Stock</label>
                    <input type="number" name="stock" className="form-control py-2 shadow-none border-light rounded-3 bg-light" value={formData.stock} onChange={handleInputChange} required />
                  </div>
                
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Product Image</label>
                    <div className="d-flex gap-3 align-items-center mb-3">
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline-secondary d-flex align-items-center gap-2 border-light">
                        <Upload size={14} /> Upload Image
                      </button>
                      <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                      {formData.image && <span className="text-muted small">Image selected</span>}
                    </div>
                    {formData.image && <img src={formData.image} className="rounded-4 border w-100 object-fit-contain mt-2 bg-light shadow-sm" style={{ maxHeight: '300px' }} />}
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input shadow-none" id="fcheck" checked={formData.featured} onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))} />
                      <label className="form-check-label small fw-bold text-muted" htmlFor="fcheck">Featured Product</label>
                    </div>
                  </div>
                  <div className="col-12 mt-5">
                    <div className="d-flex gap-3">
                      <button type="button" className="btn btn-light flex-grow-1 py-3 fw-bold border rounded-3" onClick={() => setIsModalOpen(false)}>Cancel</button>
                      <button type="submit" className="btn btn-indigo flex-grow-1 py-3 fw-bold shadow rounded-3">Save Product</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom-0 p-4">
                <h5 className="modal-title fw-bold fs-4 text-danger">Delete Product</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setDeleteModalOpen(false)}></button>
              </div>
              <div className="modal-body p-4">
                <p className="mb-0">Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-top-0 p-4">
                <button type="button" className="btn btn-light px-4" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-danger px-4" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminProducts;
