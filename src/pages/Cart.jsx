
import React, { useState } from 'react';
import { useApp } from '../App.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, addOrder, clearCart, updateProductStock, products, user } = useApp();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2 className="display-5 fw-bold mb-3">Please log in to view your cart</h2>
        <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>You must be logged in to access your shopping cart and checkout.</p>
        <button className="btn btn-indigo btn-lg px-5 rounded-pill fw-bold" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    );
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString().split('T')[0],
        customerName: 'Guest User',
        total: total,
        status: 'Pending',
        items: [...cart]
      };
      addOrder(newOrder);
      cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          updateProductStock(item.id, product.stock - item.quantity);
        }
      });
      clearCart();
      setCheckingOut(false);
      toast.success('Order placed successfully!', {
        onClose: () => navigate('/'),
        autoClose: 2000
      });
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
           <ShoppingBag size={80} className="text-light mb-4" strokeWidth={1} />
           <h2 className="display-5 fw-bold mb-3">Your bag is empty</h2>
           <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>Explore our collection and find something special for yourself or a loved one.</p>
           <Link to="/" className="btn btn-indigo btn-lg px-5 rounded-pill fw-bold">
             Start Shopping
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="display-4 fw-bold mb-5">Shopping Bag</h1>
      <div className="row g-5">
        <div className="col-lg-8">
          <div className="list-group list-group-flush border rounded-4 shadow-sm overflow-hidden">
            {cart.map(item => (
              <div key={item.id} className="list-group-item p-4">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div className="rounded-3 overflow-hidden border" style={{ width: '120px', height: '120px' }}>
                      <img src={item.image} alt={item.name} className="w-100 h-100 object-fit-cover" />
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="fw-bold mb-1">{item.name}</h5>
                        <p className="small text-muted mb-0">{item.category}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="btn btn-link text-muted p-0 shadow-none"><Trash2 size={20} /></button>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="input-group" style={{ maxWidth: '120px' }}>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="btn btn-outline-secondary btn-sm shadow-none"><Minus size={14} /></button>
                        <span className="form-control text-center py-1 fw-bold fs-6 border-secondary border-start-0 border-end-0 shadow-none bg-white">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="btn btn-outline-secondary btn-sm shadow-none"><Plus size={14} /></button>
                      </div>
                      <span className="h5 fw-bold mb-0">${item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card p-4 rounded-4 shadow-sm sticky-top border-0" style={{ top: '6rem' }}>
            <h4 className="fw-bold mb-4">Order Summary</h4>
            <div className="d-flex justify-content-between text-muted mb-3">
              <span>Subtotal</span>
              <span className="fw-bold text-dark">${subtotal}</span>
            </div>
            <div className="d-flex justify-content-between text-muted mb-4">
              <span>Shipping</span>
              <span className="fw-bold text-dark">{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-4 fw-bold mb-4">
              <span>Total</span>
              <span className="text-indigo">${total}</span>
            </div>
            <button 
              disabled={checkingOut}
              onClick={handleCheckout}
              className={`btn btn-dark btn-lg w-100 rounded-4 py-3 fw-bold shadow ${checkingOut ? 'disabled' : ''}`}
            >
              {checkingOut ? 'Processing...' : (
                <span className="d-flex align-items-center justify-content-center gap-2">Complete Purchase <ArrowRight size={20} /></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
