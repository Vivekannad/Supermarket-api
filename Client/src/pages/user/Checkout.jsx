import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
 
  // cart items passed from Cart.jsx via navigate state
  const cartItems = location.state?.cartItems || [];
 
  const [savedAddress, setSavedAddress] = useState(null);
  const [selectedItems, setSelectedItems] = useState(
    cartItems.map(item => item.cart_item_id)
  );
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [useExisting, setUseExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
 
  // ─── Fetch saved address ────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/me/address')
      .then(res => {
        if (res.data.address) {
          setSavedAddress(res.data.address);
          setUseExisting(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
  // ─── Toggle item selection ──────────────────────────────────────────────────
  const toggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
 
  // ─── Address field change ───────────────────────────────────────────────────
  const handleAddressChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };
 
  // ─── Computed total ─────────────────────────────────────────────────────────
  const selectedTotal = cartItems
    .filter(item => selectedItems.includes(item.cart_item_id))
    .reduce((sum, item) => sum + item.sub_total, 0);
 
  // ─── Place order ────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) {
      return setError('Select at least one item to order');
    }
 
    setPlacing(true);
    setError('');
 
    try {
      const body = {
        cart_items_ids: selectedItems
      };

 
      // only send address if not using existing one
      if (!useExisting) {
        const { street, city, state, zip, country } = address;
        if (!street || !city || !state || !zip || !country) {
          setError('Please fill in all address fields');
          setPlacing(false);
          return;
        }
        body.address = address;
      }
 
      const res = await api.post('/orders', {cartItemIds : body.cart_items_ids, address : body.address});
      navigate('/orders', {
        state: { newOrderId: res.data.order?.id, success: true }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
 
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl">🛒</span>
          <p className="mt-3 text-gray-900 font-medium">No items to checkout</p>
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 text-sm text-gray-900 underline"
          >
            Go back to cart
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
 
        {/* Header */}
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Checkout</h1>
 
        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        <div className="flex flex-col lg:flex-row gap-6">
 
          {/* ── Left column ───────────────────────────────────────────────── */}
          <div className="flex-1 space-y-5">
 
            {/* Step 1 — Select items */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                1 · Select items to order
              </h2>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <label
                    key={item.cart_item_id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.cart_item_id)}
                      onChange={() => toggleItem(item.cart_item_id)}
                      className="w-4 h-4 accent-gray-900 cursor-pointer"
                    />
                    {/* Image */}
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200 text-lg">
                          🛒
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × Rs. {item.product_price?.toLocaleString()}
                      </p>
                    </div>
                    {/* Subtotal */}
                    <span className="text-sm font-medium text-gray-900 shrink-0">
                      Rs. {item.sub_total?.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
 
            {/* Step 2 — Delivery address */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                2 · Delivery address
              </h2>
 
              {/* Existing address toggle */}
              {savedAddress && (
                <div className="mb-4">
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition
                      ${useExisting
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                      }`}
                    onClick={() => setUseExisting(true)}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
                        ${useExisting ? 'border-gray-900' : 'border-gray-300'}`}>
                        {useExisting && (
                          <div className="w-2 h-2 rounded-full bg-gray-900" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Use saved address</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {savedAddress.street}, {savedAddress.city}, {savedAddress.state} {savedAddress.zip}, {savedAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>
 
                  <div
                    className={`mt-2 p-3 border rounded-lg cursor-pointer transition
                      ${!useExisting
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                      }`}
                    onClick={() => setUseExisting(false)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
                        ${!useExisting ? 'border-gray-900' : 'border-gray-300'}`}>
                        {!useExisting && (
                          <div className="w-2 h-2 rounded-full bg-gray-900" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">Use a different address</p>
                    </div>
                  </div>
                </div>
              )}
 
              {/* Address form */}
              {(!savedAddress || !useExisting) && (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="Street address"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                               outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg
                                 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                    />
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      placeholder="State / Province"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg
                                 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="zip"
                      value={address.zip}
                      onChange={handleAddressChange}
                      placeholder="ZIP / Postal code"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg
                                 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                    />
                    <input
                      type="text"
                      name="country"
                      value={address.country}
                      onChange={handleAddressChange}
                      placeholder="Country"
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg
                                 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                    />
                  </div>
                </div>
              )}
            </div>
 
            {/* Step 3 — Payment method */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                3 · Payment
              </h2>
              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <span className="text-lg">💵</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Cash on delivery</p>
                  <p className="text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </div>
            </div>
 
          </div>
 
          {/* ── Right column — summary ────────────────────────────────────── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-20">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Summary</h2>
 
              {/* Selected items */}
              <div className="space-y-2 mb-4">
                {cartItems
                  .filter(item => selectedItems.includes(item.cart_item_id))
                  .map(item => (
                    <div key={item.cart_item_id} className="flex justify-between text-sm text-gray-600">
                      <span className="line-clamp-1 flex-1 mr-2">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="shrink-0">Rs. {item.sub_total?.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
 
              {selectedItems.length === 0 && (
                <p className="text-sm text-gray-400 mb-4">No items selected</p>
              )}
 
              {/* Delivery */}
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
 
              {/* Total */}
              <div className="border-t border-gray-200 pt-3 mb-4">
                <div className="flex justify-between text-sm font-semibold text-gray-900">
                  <span>Total</span>
                  <span>Rs. {selectedTotal.toLocaleString()}</span>
                </div>
              </div>
 
              {/* Place order */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing || selectedItems.length === 0}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium
                           rounded-lg hover:bg-gray-700 disabled:opacity-50
                           disabled:cursor-not-allowed transition"
              >
                {placing ? 'Placing order...' : 'Place order'}
              </button>
 
              <p className="text-xs text-gray-400 text-center mt-3">
                Cash on delivery · Free returns
              </p>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}