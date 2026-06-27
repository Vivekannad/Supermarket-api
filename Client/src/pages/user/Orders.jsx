import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
 
const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:   'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};
 
export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');
 
  const newOrderId = location.state?.newOrderId;
 
  useEffect(() => {
    api.get('/me/orders')
      .then(res => setOrders(res.data.orders || res.data || []))
      .catch(() => setError('Could not load orders'))
      .finally(() => setLoading(false));
  }, []);
 
  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await api.put(`/orders/cancel/${orderId}`);
      setOrders(prev =>
        prev.map(o => o.order_id === orderId ? { ...o, status: 'cancelled' } : o)
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel order');
      setTimeout(() => setError(''), 3000);
    } finally {
      setCancellingId(null);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-gray-100 rounded w-24" />
                <div className="h-4 bg-gray-100 rounded w-16" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
 
  if (orders.length === 0 && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">📦</span>
          <p className="mt-4 text-gray-900 font-medium">No orders yet</p>
          <p className="text-sm text-gray-500 mt-1">Your orders will appear here</p>
          <button
            onClick={() => navigate('/')}
            className="mt-5 inline-block px-5 py-2.5 bg-gray-900 text-white text-sm
                       font-medium rounded-lg hover:bg-gray-700 transition"
          >
            Browse products
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
 
        <h1 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h1>
 
        {/* Success banner */}
        {newOrderId && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✓ Order placed successfully!
          </div>
        )}
 
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.order_id}
              className={`bg-white border rounded-xl overflow-hidden transition hover:shadow-sm
                          ${newOrderId === order.order_id
                            ? 'border-gray-900 ring-1 ring-gray-900'
                            : 'border-gray-200'}`}
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Order #{order.order_id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })
                      : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize
                                    ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    Rs. {Number(order.total)?.toLocaleString()}
                  </span>
                </div>
              </div>
 
              {/* Items */}
              <div className="px-5 py-4 space-y-3">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name}
                             className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200 text-sm">🛒</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-1">{item.product_name}</p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} × Rs. {Number(item.product_price)?.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-700 shrink-0">
                      Rs. {Number(item.sub_total)?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
 
              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                <Link
                  to={`/order/${order.order_id}`}
                  className="text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  View details →
                </Link>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(order.order_id)}
                    disabled={cancellingId === order.order_id}
                    className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 transition"
                  >
                    {cancellingId === order.order_id ? 'Cancelling...' : 'Cancel order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}