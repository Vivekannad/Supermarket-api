import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
 
const StatCard = ({ label, value, sub, color = 'gray' }) => {
  const colors = {
    gray:   'bg-white',
    green:  'bg-green-50',
    yellow: 'bg-yellow-50',
    red:    'bg-red-50',
    blue:   'bg-blue-50',
  };
  return (
    <div className={`${colors[color]} border border-gray-200 rounded-xl p-5`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
};
 
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data.adminStats || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    }, []);
    
    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
                <div className="h-7 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
 
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Manage products
            </Link>
            <Link
              to="/admin/orders"
              className="text-sm px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Manage orders
            </Link>
          </div>
        </div>
 
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total users" value={stats?.total_users} />
          <StatCard label="Total products" value={stats?.total_products} />
          <StatCard label="Total orders" value={stats?.total_orders} />
          <StatCard
            label="Total revenue"
            value={`Rs. ${Number(stats?.total_revenue || 0).toLocaleString()}`}
            color="green"
          />
          <StatCard label="Pending orders" value={stats?.pending_orders} color="yellow" />
          <StatCard label="Delivered orders" value={stats?.delivered_orders} color="green" />
          <StatCard label="Cancelled orders" value={stats?.cancelled_orders} color="red" />
          <StatCard
            label="Out of stock"
            value={stats?.out_of_stock_products}
            sub="products need restocking"
            color={stats?.out_of_stock_products > 0 ? 'red' : 'gray'}
          />
        </div>
 
        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Add new product', to: '/admin/products/add', icon: '➕' },
            { label: 'View all orders', to: '/admin/orders', icon: '📦' },
            { label: 'View all users', to: '/admin/users', icon: '👥' },
            { label: 'Manage categories', to: '/admin/categories', icon: '🏷' }
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl
                         p-4 hover:shadow-sm hover:border-gray-400 transition"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium text-gray-900">{link.label}</span>
              <span className="ml-auto text-gray-400">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
 