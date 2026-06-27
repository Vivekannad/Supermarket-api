import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:   'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};
 
const NEXT_STATUS = {
  pending:   'confirmed',
  confirmed: 'shipped',
  shipped:   'delivered',
};
 
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
 
  useEffect(() => {
    api.get('/orders/admin/getorders')
      .then(res => setOrders(res.data.orders || res.data || []))
      .catch(() => setError('Could not load orders'))
      .finally(() => setLoading(false));
  }, []);
 
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/admin/updateorderstatus/${orderId}`, { status: newStatus });
      setOrders(prev =>
        prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdatingId(null);
    }
  };
 
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-4 bg-gray-100 rounded w-24" />
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
 
        <h1 className="text-xl font-semibold text-gray-900 mb-6">All Orders</h1>
 
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm px-3 py-1.5 rounded-lg border capitalize transition
                ${filter === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-300 text-gray-600 hover:border-gray-500'}`}
            >
              {s}
            </button>
          ))}
        </div>
 
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-4xl">📦</span>
            <p className="mt-3 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => (
              <div key={order.order_id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
 
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order #{order.order_id}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.username} · Rs. {order.total?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize
                                      ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                    {/* Advance status button */}
                    {NEXT_STATUS[order.status] && (
                      <button
                        onClick={() => handleStatusUpdate(order.order_id, NEXT_STATUS[order.status])}
                        disabled={updatingId === order.order_id}
                        className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg
                                   hover:bg-gray-700 disabled:opacity-50 transition capitalize"
                      >
                        {updatingId === order.order_id
                          ? '...'
                          : `Mark ${NEXT_STATUS[order.status]}`}
                      </button>
                    )}
                    {/* Cancel button */}
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button
                        onClick={() => handleStatusUpdate(order.order_id, 'cancelled')}
                        disabled={updatingId === order.order_id}
                        className="text-xs px-3 py-1.5 border border-red-300 text-red-600
                                   rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
 
                {/* Items preview */}
                <div className="px-5 py-4">
                  <div className="space-y-2">
                    {(order.items || []).slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                        <span className="line-clamp-1">
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="ml-auto shrink-0 text-gray-500">
                          Rs. {item.sub_total?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    {(order.items || []).length > 3 && (
                      <p className="text-xs text-gray-400 pl-4">
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}