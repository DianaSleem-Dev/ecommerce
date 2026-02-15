
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, user } = useApp();
  const product = products.find(p => p.id === id);
  
  // removed unused insight and loadingInsight state

  

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2 className="display-6 fw-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-link text-indigo fw-bold">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link text-muted d-flex align-items-center gap-2 p-0 mb-5 text-decoration-none"
      >
        <ArrowLeft size={20} /> Back to Collection
      </button>

      <div className="row g-5 align-items-start">
        <div className="col-lg-6">
          <div className="rounded-4 overflow-hidden shadow-sm border" style={{ maxHeight: '700px' }}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-100 h-100 object-fit-cover"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="mb-4">
            <span className="badge bg-indigo-light text-indigo rounded-pill px-3 py-2 mb-3 text-uppercase fw-bold tracking-widest">
              {product.category}
            </span>
            <h1 className="display-4 fw-bold mb-2">{product.name}</h1>
            <p className="display-6 fw-light text-muted">${product.price}.00</p>
          </div>

          <p className="lead text-muted mb-5" style={{ lineHeight: '1.8' }}>{product.description}</p>


          <div className="mb-5">
            <button 
              onClick={() => user ? addToCart(product) : null}
              disabled={product.stock === 0 || !user}
              className={`btn btn-lg w-100 rounded-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-3 shadow ${product.stock === 0 || !user ? 'btn-secondary' : 'btn-dark'}`}
            >
              <ShoppingCart size={20} /> {product.stock === 0 ? 'Out of Stock' : !user ? 'Login to Add' : 'Add to Cart'}
            </button>
            <p className="text-center small text-muted mt-3">Complimentary priority shipping on this item.</p>
          </div>

          <div className="row g-4 pt-4 border-top">
            <div className="col-md-4 d-flex align-items-center gap-3">
              <div className="bg-light p-2 rounded text-muted"><Truck size={20} /></div>
              <div className="small fw-bold lh-sm">Free Express<br/>Shipping</div>
            </div>
            <div className="col-md-4 d-flex align-items-center gap-3">
              <div className="bg-light p-2 rounded text-muted"><RotateCcw size={20} /></div>
              <div className="small fw-bold lh-sm">30-Day Pure<br/>Returns</div>
            </div>
            <div className="col-md-4 d-flex align-items-center gap-3">
              <div className="bg-light p-2 rounded text-muted"><ShieldCheck size={20} /></div>
              <div className="small fw-bold lh-sm">Authenticity<br/>Guaranteed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
