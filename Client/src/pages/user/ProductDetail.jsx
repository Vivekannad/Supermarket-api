import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../api/axios';
 
export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });
 
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 2500);
  };
 
  // ─── Fetch product ──────────────────────────────────────────────────────────
  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data.product || res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);
 
  // ─── Add to cart ────────────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    setAdding(true);
    try {
      await addToCart(product.product_id, quantity);
      showToast(`${product.product_name} added to cart`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };
 
  // ─── Skeleton ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="w-full md:w-96 aspect-square bg-gray-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-4 py-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  if (!product) return null;
 
  const outOfStock = product.product_stock === 0;
 
  return (
    <div className="min-h-screen bg-gray-50">
 
      {/* Toast */}
      {toast.msg && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm text-white
                         ${toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}
 
      <div className="max-w-4xl mx-auto px-4 py-8">
 
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 transition"
        >
          ← Back
        </button>
 
        <div className="flex flex-col md:flex-row gap-8">
 
          {/* ── Image ──────────────────────────────────────────────────── */}
          <div className="w-full md:w-96 shrink-0">
            <div className="aspect-square bg-white border border-gray-200 rounded-xl overflow-hidden">
              {product.product_image ? (
                <img
                  src={product.product_image}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-200">
                  🛒
                </div>
              )}
            </div>
          </div>
 
          {/* ── Info ───────────────────────────────────────────────────── */}
          <div className="flex-1">
 
            {/* Categories */}
            {product.categories?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.categories.map((cat, i) => (
                  <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            )}
 
            {/* Name */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {product.product_name}
            </h1>
 
            {/* Price */}
            <p className="text-xl font-bold text-gray-900 mb-4">
              Rs. {product.product_price?.toLocaleString()}
            </p>
 
            {/* Stock badge */}
            <div className="mb-4">
              {outOfStock ? (
                <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                  Out of stock
                </span>
              ) : (
                <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                  {product.product_stock} in stock
                </span>
              )}
            </div>
 
            {/* Description */}
            {product.product_description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {product.product_description}
              </p>
            )}
 
            <div className="border-t border-gray-200 mb-6" />
 
            {/* Quantity + Add to cart */}
            {!outOfStock && (
              <div className="flex items-center gap-3 mb-3">
                {/* Quantity */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-700
                               hover:bg-gray-100 transition text-sm"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.product_stock, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-700
                               hover:bg-gray-100 transition text-sm"
                  >
                    +
                  </button>
                </div>
 
                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium
                             rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  {adding ? 'Adding...' : 'Add to cart'}
                </button>
              </div>
            )}
 
            {/* View cart */}
            {!outOfStock && (
              <button
                onClick={() => navigate('/cart')}
                className="w-full py-2.5 border border-gray-300 text-gray-700 text-sm
                           font-medium rounded-lg hover:bg-gray-100 transition"
              >
                View cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 