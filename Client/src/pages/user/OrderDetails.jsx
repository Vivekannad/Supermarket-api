import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];
 
const STEP_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped:   'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};
 
export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
 
  useEffect(() => {
    api.get(`/orders/getorder/${id}`)
      .then(res => {
        const data = res.data.order || res.data;

        console.log(data);

        // data could be an array of rows or a single object with items array
        if (Array.isArray(data)) {
          setItems(data[0].items || []);
          setOrder(data[0]);
        } else {
          setOrder(data);
          setItems(data.items || []);
        }
      })
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id, navigate]);
 
  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      await api.put(`/orders/cancel/${id}`);
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel order');
      setTimeout(() => setError(''), 3000);
    } finally {
      setCancelling(false);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
 
  if (!order) return null;
 
  const isCancelled = order.status === 'cancelled';
  const currentStep = STATUS_STEPS.indexOf(order.status);
  const total = order.total ?? items.reduce((s, i) => s + Number(i.sub_total || 0), 0);
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
 
        {/* Back */}
        <button
          onClick={() => navigate('/orders')}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 transition"
        >
          ← Back to orders
        </button>
 
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Order #{id}</h1>
            {order.created_at && (
              <p className="text-sm text-gray-400 mt-0.5">
                Placed on {new Date(order.created_at).toLocaleDateString('en-PK', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            )}
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize
                            ${STEP_STYLES[order.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {order.status}
          </span>
        </div>
 
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        {/* ── Status tracker ────────────────────────────────────────────── */}
        {!isCancelled && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
            <p className="text-sm font-semibold text-gray-900 mb-5">Order progress</p>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    {/* Circle */}
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                      ${i <= currentStep ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white'}`}>
                      {i < currentStep ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : i === currentStep ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      ) : null}
                    </div>
                    {/* Label */}
                    <p className={`text-xs capitalize mt-1.5 whitespace-nowrap
                      ${i <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                      {step}
                    </p>
                  </div>
                  {/* Connector line */}
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4
                      ${i < currentStep ? 'bg-gray-900' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* Cancelled banner */}
        {isCancelled && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            This order was cancelled.
          </div>
        )}
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
 
          {/* ── Items list ────────────────────────────────────────────── */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  Items ({items.length})
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      {item.product_image ? (
                        <img src={item.product_image} alt={item.product_name}
                             className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">🛒</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.quantity} × Rs. {Number(item.product_price)?.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 shrink-0">
                      Rs. {Number(item.sub_total)?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              {/* Total */}
              <div className="flex justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-sm font-bold text-gray-900">
                  Rs. {Number(total)?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
 
          {/* ── Sidebar ───────────────────────────────────────────────── */}
          <div className="space-y-4">
 
            {/* Delivery address */}
            {/* <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Delivery address</p>
              {order.shipping_street ? (
                <address className="text-sm text-gray-600 not-italic leading-relaxed">
                  {order.shipping_street}<br />
                  {order.shipping_city}{order.shipping_state ? `, ${order.shipping_state}` : ''}<br />
                  {order.shipping_zip && <>{order.shipping_zip}<br /></>}
                  {order.shipping_country}
                </address>
              ) : (
                <p className="text-sm text-gray-400">No address on record</p>
              )}
            </div> */}
 
            {/* Payment */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Payment</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cash on delivery</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                  ${order.payment_status === 'paid'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'}`}>
                  {order.payment_status || 'pending'}
                </span>
              </div>
            </div>
 
            {/* Cancel */}
            {order.status === 'pending' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full py-2.5 border border-red-300 text-red-600 text-sm
                           font-medium rounded-lg hover:bg-red-50 disabled:opacity-50 transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}