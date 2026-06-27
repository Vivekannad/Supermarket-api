import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

 
export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState('');
 
  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data.products || res.data || []))
      .catch(() => setError('Could not load products'))
      .finally(() => setLoading(false));
  }, []);
 
  const handleRemove = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    setRemovingId(id);
    try {
      await api.delete(`/products/removeproduct/${id}`);
      setProducts(prev => prev.filter(p => p.product_id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove product');
      setTimeout(() => setError(''), 3000);
    } finally {
      setRemovingId(null);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse flex gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
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
 
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Products
            <span className="ml-2 text-sm font-normal text-gray-400">({products.length})</span>
          </h1>
          <Link
            to="/admin/products/add"
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
          >
            + Add product
          </Link>
        </div>
 
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {products.length === 0 ? (
            <div className="py-16 text-center">
              <span className="text-4xl">📦</span>
              <p className="mt-3 text-gray-900 font-medium">No products yet</p>
              <Link to="/admin/products/add" className="mt-2 inline-block text-sm text-gray-500 underline">
                Add your first product
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(product => (
                  <tr key={product.product_id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {product.product_image ? (
                            <img src={product.product_image} alt={product.product_name}
                                 className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">🛒</div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{product.product_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(product.categories || []).map((cat, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right text-gray-700">
                      Rs. {product.product_price?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-xs font-medium ${product.product_stock === 0 ? 'text-red-600' : 'text-gray-700'}`}>
                        {product.product_stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/admin/product/edit/${product.product_id}`)}
                          className="text-sm text-gray-500 hover:text-gray-900 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(product.product_id)}
                          disabled={removingId === product.product_id}
                          className="text-sm text-red-400 hover:text-red-600 disabled:opacity-50 transition"
                        >
                          {removingId === product.product_id ? '...' : 'Remove'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}