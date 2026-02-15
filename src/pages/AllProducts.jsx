import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App.jsx';
import { Search, ArrowRight, SlidersHorizontal, ChevronDown } from 'lucide-react';

const AllProducts = () => {
  const { products, addToCart, user } = useApp();
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.description.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });

    // Sort
    switch(sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return filtered;
    }
  }, [products, category, search, priceRange, sortBy]);

  const maxPrice = Math.max(...products.map(p => p.price), 1000);

  return (
    <div>
      <section className="bg-light border-bottom py-4">
        <div className="container">
          <h1 className="display-4 fw-bold mb-0">All Products</h1>
          <p className="text-muted mb-0">Browse our complete collection</p>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4">
          {/* Filter Sidebar - Desktop */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="bg-white rounded-4 shadow-sm p-4 sticky-top" style={{ top: '6rem' }}>
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <SlidersHorizontal size={18} /> Filters
              </h5>

              {/* Search */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Search</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 py-2 shadow-none" 
                    placeholder="Search products..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted mb-2">Category</label>
                <div className="d-flex flex-column gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`btn text-start btn-sm ${
                        category === cat 
                        ? 'btn-indigo' 
                        : 'btn-light text-muted'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted mb-2">Price Range</label>
                <div className="d-flex gap-2 mb-2">
                  <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    placeholder="Min" 
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
                  />
                  <input 
                    type="number" 
                    className="form-control form-control-sm" 
                    placeholder="Max" 
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                  />
                </div>
                <small className="text-muted">${priceRange[0]} - ${priceRange[1]}</small>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted mb-2">Sort By</label>
                <select 
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  setCategory('All');
                  setSearch('');
                  setPriceRange([0, maxPrice]);
                  setSortBy('newest');
                }}
                className="btn btn-light w-100 btn-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="col-lg-9">
            {/* Mobile Filter Toggle */}
            <div className="d-lg-none mb-4">
              <button 
                className="btn btn-light w-100 d-flex align-items-center justify-content-between"
                onClick={() => setShowFilters(!showFilters)}
              >
                <span className="d-flex align-items-center gap-2"><SlidersHorizontal size={18} /> Filters</span>
                <ChevronDown size={18} style={{transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s'}} />
              </button>

              {showFilters && (
                <div className="bg-light rounded-3 p-4 mt-2">
                  {/* Mobile Filter Content */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Search</label>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text bg-white border-end-0"><Search size={16} /></span>
                      <input 
                        type="text" 
                        className="form-control border-start-0 shadow-none" 
                        placeholder="Search..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-2">Category</label>
                    <div className="d-flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategory(cat)}
                          className={`btn btn-sm ${
                            category === cat 
                            ? 'btn-indigo' 
                            : 'btn-light text-muted'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted mb-2">Sort By</label>
                    <select 
                      className="form-select form-select-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Products Grid */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {filteredAndSortedProducts.length > 0 ? filteredAndSortedProducts.map(product => (
                <div key={product.id} className="col">
                  <div className="card h-100 border-0 group shadow-sm hover-shadow" style={{transition: '0.3s'}}>
                    <Link to={`/product/${product.id}`} className="rounded-3 overflow-hidden position-relative d-block border">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-100 object-fit-cover" 
                        style={{ height: '250px' }}
                      />
                      {product.featured && (
                        <span className="position-absolute top-2 start-2 badge bg-indigo">Featured</span>
                      )}
                    </Link>
                    <div className="card-body px-0 pt-3">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <Link to={`/product/${product.id}`} className="h6 fw-bold text-dark text-decoration-none">{product.name}</Link>
                        <span className="fw-bold text-indigo">${product.price}</span>
                      </div>
                      <p className="small text-muted mb-3 text-truncate">{product.description}</p>
                      <div className="d-flex gap-2">
                        <button 
                          onClick={() => user ? addToCart(product) : null}
                          disabled={product.stock === 0 || !user}
                          className={`btn btn-sm w-100 rounded-2 fw-bold ${product.stock === 0 || !user ? 'btn-secondary' : 'btn-dark'}`}
                        >
                          {product.stock === 0 ? 'Out of Stock' : !user ? 'Login' : 'Add'}
                        </button>
                        <Link to={`/product/${product.id}`} className="btn btn-sm btn-light rounded-2">
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-5">
                  <p className="text-muted fs-5">No products found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setCategory('All');
                      setSearch('');
                      setPriceRange([0, maxPrice]);
                      setSortBy('newest');
                    }}
                    className="btn btn-link text-indigo fw-bold text-decoration-none"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            {filteredAndSortedProducts.length > 0 && (
              <div className="text-center mt-4 text-muted small">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;