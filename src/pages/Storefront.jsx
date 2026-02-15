
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { Search, ArrowRight } from 'lucide-react';

const Storefront = () => {
  const { products, addToCart, user } = useApp();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const featured = products.filter(p => p.featured).slice(0, 3);

  return (
    <div>
      <section className="position-relative overflow-hidden bg-dark text-white d-flex align-items-center" style={{ height: '60vh' }}>
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero" 
          className="position-absolute w-100 h-100 object-fit-cover opacity-50"
        />
        <div className="container position-relative text-center">
          <h1 className="display-2 fw-bold mb-4">Redefining Elegance</h1>
          <p className="lead fw-light mb-5 mx-auto" style={{ maxWidth: '700px' }}>
            Discover our curated collection of luxury essentials designed for the discerning individual.
          </p>
          <button 
            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-light btn-lg rounded-pill px-5 fw-bold d-inline-flex align-items-center gap-2"
          >
            Shop Collection <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <section className="container py-5">
        <div className="mb-5">
          <h2 className="display-5 fw-bold">Featured Pieces</h2>
          <p className="text-muted">Handpicked for exceptional quality</p>
        </div>
        <div className="row g-4">
          {featured.map(product => (
            <div key={product.id} className="col-md-4">
              <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                <div className="card h-100 shadow-sm overflow-hidden border-0">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="card-img-top object-fit-cover" 
                    style={{ height: '300px' }}
                  />
                  <div className="card-body p-4">
                    <span className="text-indigo text-uppercase small fw-bold tracking-widest mb-2 d-block">{product.category}</span>
                    <h3 className="h4 fw-bold mb-1">{product.name}</h3>
                    <p className="fs-5 text-muted mb-0">${product.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="container py-5">
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5">
          <div className="row align-items-center mb-5 gy-4">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={20} className="text-muted" />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0 py-2 shadow-none" 
                  placeholder="Search our catalog..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="d-flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`btn rounded-pill px-4 text-nowrap transition-all ${
                      category === cat 
                      ? 'btn-indigo shadow-sm' 
                      : 'btn-light text-muted border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="col">
                <div className="card h-100 border-0 group">
                  <Link to={`/product/${product.id}`} className="rounded-3 overflow-hidden position-relative d-block border">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-100 object-fit-cover" 
                      style={{ height: '300px' }}
                    />
                  </Link>
                  <div className="card-body px-0 pt-3">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <Link to={`/product/${product.id}`} className="h6 fw-bold text-dark text-decoration-none">{product.name}</Link>
                      <span className="fw-medium text-muted">${product.price}</span>
                    </div>
                    <p className="small text-muted mb-3 text-truncate">{product.description}</p>
                    <button 
                      onClick={() => user ? addToCart(product) : null}
                      disabled={product.stock === 0 || !user}
                      className={`btn w-100 rounded-3 py-2 fw-bold ${product.stock === 0 || !user ? 'btn-secondary' : 'btn-dark'}`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : !user ? 'Login to Add' : 'Quick Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted fs-5">No products found matching your criteria.</p>
              <button onClick={() => {setCategory('All'); setSearch('');}} className="btn btn-link text-indigo fw-bold text-decoration-none">Clear all filters</button>
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-indigo btn-lg rounded-pill px-5 fw-bold d-inline-flex align-items-center gap-2">
              View All Products <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Storefront;
