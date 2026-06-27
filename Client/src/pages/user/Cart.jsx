import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function Cart() {
  const navigate = useNavigate();
 
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
 
  // ─── Fetch cart ─────────────────────────────────────────────────────────────
  const fetchCart = async () => {
    try {
      const res = await api.get('/cart/view');
      const items = res.data.cartItems || res.data || [];
      const total = items.reduce((sum, item) => sum + item.sub_total, 0);
      setCart({ items, total });
    } catch {
      setError('Could not load cart');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchCart(); }, []);
 
  // ─── Update quantity ─────────────────────────────────────────────────────────
  const handleQuantityChange = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(cartItemId);
    try {
      await api.patch(`/cart/items/${cartItemId}`, { quantity: newQty });
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update quantity');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingId(null);
    }
  };
 
  // ─── Remove item ─────────────────────────────────────────────────────────────
  const handleRemove = async (cartItemId) => {
    setUpdatingId(cartItemId);
    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove item');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingId(null);
    }
  };
 
  // ─── Clear cart ──────────────────────────────────────────────────────────────
  const handleClearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [], total: 0 });
    } catch {
      setError('Could not clear cart');
      setTimeout(() => setError(''), 3000);
    }
  };
 
  // ─── Skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
 
  // ─── Empty cart ──────────────────────────────────────────────────────────────
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">🛒</span>
          <p className="mt-4 text-gray-900 font-medium">Your cart is empty</p>
          <p className="text-sm text-gray-500 mt-1">Add some products to get started</p>
          <Link
            to="/"
            className="mt-5 inline-block px-5 py-2.5 bg-gray-900 text-white text-sm
                       font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
 
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Cart
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({cart.items.length} item{cart.items.length !== 1 ? 's' : ''})
            </span>
          </h1>
          <button
            onClick={handleClearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition"
          >
            Clear all
          </button>
        </div>
 
        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        <div className="flex flex-col lg:flex-row gap-6">
 
          {/* ── Cart items ────────────────────────────────────────────────── */}
          <div className="flex-1 space-y-3">
            {cart.items.map(item => (
              <div
                key={item.cart_item_id}
                className={`bg-white border border-gray-200 rounded-xl p-4 flex gap-4
                            transition ${updatingId === item.cart_item_id ? 'opacity-50' : ''}`}
              >
                {/* Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                  {item.product_image ? (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-gray-200">
                      🛒
                    </div>
                  )}
                </div>
 
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.product_id}`}
                    className="text-sm font-medium text-gray-900 hover:underline line-clamp-1"
                  >
                    {item.product_name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Rs. {item.product_price?.toLocaleString()} each
                  </p>
 
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingId === item.cart_item_id}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300
                                 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40
                                 disabled:cursor-not-allowed transition text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                      disabled={updatingId === item.cart_item_id}
                      className="w-7 h-7 flex items-center justify-center border border-gray-300
                                 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-40
                                 disabled:cursor-not-allowed transition text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
 
                {/* Right side — subtotal + remove */}
                <div className="flex flex-col items-end justify-between shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    Rs. {item.subtotal?.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemove(item.cart_item_id)}
                    disabled={updatingId === item.cart_item_id}
                    className="text-xs text-gray-400 hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
 
          {/* ── Order summary ─────────────────────────────────────────────── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Order summary</h2>
 
              {/* Line items */}
              <div className="space-y-2 mb-4">
                {cart.items.map(item => (
                  <div key={item.cart_item_id} className="flex justify-between text-sm text-gray-600">
                    <span className="line-clamp-1 flex-1 mr-2">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="shrink-0">Rs. {item.subtotal?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
 
              {/* Divider */}
              <div className="border-t border-gray-200 pt-3 mb-4">
                <div className="flex justify-between text-sm font-semibold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {cart.total?.toLocaleString()}</span>
                </div>
              </div>
 
              {/* Checkout button */}
              <button
                onClick={() => navigate('/checkout', { state: { cartItems: cart.items } })}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium
                           rounded-lg hover:bg-gray-700 transition"
              >
                Proceed to checkout
              </button>
 
              {/* Continue shopping */}
              <Link
                to="/"
                className="block text-center text-sm text-gray-500 hover:text-gray-900
                           mt-3 transition"
              >
                Continue shopping
              </Link>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}
 