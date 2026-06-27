import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function AdminCategories() {
  const navigate = useNavigate();
 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [addError, setAddError] = useState('');
  const [removeError, setRemoveError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
 
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };
 
  // ─── Fetch categories ────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data.categories || []);
    } catch {
      setRemoveError('Could not load categories');
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchCategories(); }, []);
 
  // ─── Add category ─────────────────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return setAddError('Category name is required');
    setAdding(true);
    setAddError('');
    try {
      const res = await api.post('/products/addcategory', { name: newCategory.trim() });
      setCategories(prev => [...prev, res.data.category || res.data]);
      setNewCategory('');
      showSuccess(`"${newCategory.trim()}" added successfully`);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Could not add category');
    } finally {
      setAdding(false);
    }
  };
 
  // ─── Remove category ─────────────────────────────────────────────────────────
  // const handleRemove = async (cat) => {
  //   if (!window.confirm(`Remove "${cat.name}"? Products in this category will lose this tag.`)) return;
  //   setRemovingId(cat.id);
  //   setRemoveError('');
  //   try {
  //     await api.delete(`/products/removecategory/${cat.id}`);
  //     setCategories(prev => prev.filter(c => c.id !== cat.id));
  //     showSuccess(`"${cat.name}" removed`);
  //   } catch (err) {
  //     setRemoveError(err.response?.data?.message || 'Could not remove category');
  //     setTimeout(() => setRemoveError(''), 3000);
  //   } finally {
  //     setRemovingId(null);
  //   }
  // };
 
  // ─── Skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
            <div className="flex gap-3">
              <div className="flex-1 h-9 bg-gray-100 rounded-lg" />
              <div className="w-24 h-9 bg-gray-100 rounded-lg" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center px-5 py-4 border-b border-gray-100 last:border-0">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
 
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
          <button
            onClick={() => navigate('/admin/products')}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Products
          </button>
        </div>
 
        {/* Success toast */}
        {successMsg && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            ✓ {successMsg}
          </div>
        )}
 
        {/* ── Add category ────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
          <p className="text-sm font-semibold text-gray-900 mb-3">Add new category</p>
 
          {addError && (
            <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {addError}
            </div>
          )}
 
          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={e => {
                setNewCategory(e.target.value);
                setAddError('');
              }}
              placeholder="e.g. Dairy, Beverages, Snacks"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                         focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
            />
            <button
              type="submit"
              disabled={adding || !newCategory.trim()}
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg
                         hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition
                         whitespace-nowrap"
            >
              {adding ? 'Adding...' : '+ Add'}
            </button>
          </form>
 
          {/* Preview slug */}
          {newCategory.trim() && (
            <p className="text-xs text-gray-400 mt-2">
              Slug: <span className="font-mono">{newCategory.trim().toLowerCase().replace(/\s+/g, '-')}</span>
            </p>
          )}
        </div>
 
        {/* ── Category list ────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
 
          {/* List header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              All categories
            </p>
            <p className="text-xs text-gray-400">{categories.length} total</p>
          </div>
 
          {removeError && (
            <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-sm text-red-600">
              {removeError}
            </div>
          )}
 
          {categories.length === 0 ? (
            <div className="py-14 text-center">
              <span className="text-4xl">🏷</span>
              <p className="mt-3 text-gray-900 font-medium text-sm">No categories yet</p>
              <p className="text-xs text-gray-400 mt-1">Add your first category above</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.length > 0 && categories.map(cat => (
                <div
                  key={cat.id}
                  className={`flex items-center justify-between px-5 py-3.5 transition
                              hover:bg-gray-50
                              ${removingId === cat.id ? 'opacity-50' : ''}`}
                >
                  {/* Left — name + slug */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-gray-500">
                        {cat.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                      {cat.slug && (
                        <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                      )}
                    </div>
                  </div>
 
                  {/* Right — id + remove */}
                  {/* <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-gray-300">#{cat.id}</span>
                    <button
                      onClick={() => handleRemove(cat)}
                      disabled={removingId === cat.id}
                      className="text-sm text-gray-400 hover:text-red-500
                                 disabled:opacity-50 transition"
                      title={`Remove ${cat.name}`}
                    >
                      {removingId === cat.id ? '...' : 'Remove'}
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* Info note */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          Removing a category unlinks it from all products but does not delete the products themselves.
        </p>
 
      </div>
    </div>
  );
}