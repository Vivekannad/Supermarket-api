import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { ProductCard } from '../../components/products/ProductCard';
import {useCart} from "../../context/CartContext"
 
export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartMsg, setCartMsg] = useState('');
 
  const [filters, setFilters] = useState({
    q: '',
    categoryId: '',
    minprice: '',
    maxprice: '',
    page: 1,
    limit: 10
  });
 
  // ─── Fetch categories ───────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/products/categories')
      .then(res => setCategories(res.data.categories))
      .catch(() => {});
  }, []);
 
  // ─── Fetch products ─────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.minprice) params.minprice = filters.minprice;
      if (filters.maxprice) params.maxprice = filters.maxprice;
      params.page = filters.page;
      params.limit = filters.limit;
 
      const res = await api.get('/products', { params });
      setProducts(res.data.products || res.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);
 
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
 
  // ─── Add to cart ────────────────────────────────────────────────────────────
  const handleAddToCart = async (product) => {
    if (!user) return navigate('/login');
    try {
      await api.post('/cart/add', {
        productId: product.product_id,
        quantity: 1
      });
      setCartMsg(`${product.product_name} added to cart`);
      // addToCart(product.product_id, 1);
      
      setTimeout(() => setCartMsg(''), 2500);
    } catch (err) {
      setCartMsg(err.response?.data?.message || 'Could not add to cart');
      setTimeout(() => setCartMsg(''), 2500);
    }
  };
 
  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    setFilters(f => ({ ...f, q: e.target.value, page: 1 }));
  };
 
  const handleCategory = (id) => {
    setFilters(f => ({ ...f, categoryId: f.categoryId === id ? '' : id, page: 1 }));
  };
 
  const handlePriceFilter = (e) => {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value, page: 1 }));
  };
 
  const clearFilters = () => {
    setFilters({ q: '', categoryId: '', minprice: '', maxprice: '', page: 1, limit: 12 });
  };
 
  const hasActiveFilters = filters.q || filters.categoryId || filters.minprice || filters.maxprice;
 
  return (
    <div className="min-h-screen bg-gray-50">
 
      {/* Toast notification */}
      {cartMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white text-sm
                        px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          {cartMsg}
        </div>
      )}
 
      <div className="max-w-6xl mx-auto px-4 py-8">
 
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {products.length} item{products.length !== 1 ? 's' : ''} available
          </p>
        </div>
 
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={filters.q}
            onChange={handleSearch}
            placeholder="Search products..."
            className="w-full sm:w-80 px-4 py-2 text-sm border border-gray-300 rounded-lg
                       outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition bg-white"
          />
        </div>
 
        <div className="flex flex-col lg:flex-row gap-6">
 
          {/* ── Sidebar filters ─────────────────────────────────────────────── */}
          <aside className="w-full lg:w-52 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-5">
 
              {/* Categories */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Category
                </p>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategory(String(cat.id))}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition
                        ${filters.categoryId === String(cat.id)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Price range */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Price range
                </p>
                <div className="space-y-2">
                  <input
                    type="number"
                    name="minprice"
                    value={filters.minprice}
                    onChange={handlePriceFilter}
                    placeholder="Min (Rs.)"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                               outline-none focus:border-gray-900 transition"
                  />
                  <input
                    type="number"
                    name="maxprice"
                    value={filters.maxprice}
                    onChange={handlePriceFilter}
                    placeholder="Max (Rs.)"
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                               outline-none focus:border-gray-900 transition"
                  />
                </div>
              </div>
 
              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-gray-500 hover:text-gray-900 underline transition"
                >
                  Clear filters
                </button>
              )}
            </div>
          </aside>
 
          {/* ── Product grid ────────────────────────────────────────────────── */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-8 bg-gray-100 rounded mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl mb-3">🔍</span>
                <p className="text-gray-900 font-medium">No products found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-gray-900 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.map(product => (
                    <ProductCard
                      key={product.product_id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
 
                {/* Pagination */}
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                    disabled={filters.page === 1}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg
                               hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">Page {filters.page}</span>
                  <button
                    onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                    disabled={products.length < filters.limit}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg
                               hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
 