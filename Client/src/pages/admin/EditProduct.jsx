import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryIds: [],
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
 
  // ─── Fetch product + categories ─────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get(`/products/${id}`),
      api.get('/products/categories'),
    ])
      .then(([productRes, categoriesRes]) => {
        const product = productRes.data.product || productRes.data;
        const cats = categoriesRes.data.categories || [];
 
        setCategories(cats);
        setForm({
          name: product.product_name || '',
          description: product.product_description || '',
          price: product.product_price || '',
          stock: product.product_stock || '',
          categoryIds: [],   // categories from product are names, not ids — user re-selects
          image: null,
        });
 
        // if product has image, show it as current preview
        if (product.image_url) setPreview(product.image_url);
 
        // try to match current category names back to ids
        if (product.categories?.length > 0 && cats.length > 0) {
          const matchedIds = cats
            .filter(c => product.categories.includes(c.name))
            .map(c => c.id);
          setForm(f => ({ ...f, categoryIds: matchedIds }));
        }
      })
      .catch(() => navigate('/admin/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);
 
  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };
 
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file }));
    setPreview(URL.createObjectURL(file));
  };
 
  const toggleCategory = (catId) => {
    setForm(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(catId)
        ? f.categoryIds.filter(c => c !== catId)
        : [...f.categoryIds, catId]
    }));
  };
 
  // ─── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.categoryIds.length === 0) {
      return setError('Select at least one category');
    }
    setSaving(true);
    setError('');
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('stock', form.stock);
      data.append('categoryIds', JSON.stringify(form.categoryIds));
      if (form.image) data.append('image', form.image);
 
      await api.put(`/products/editproduct/${id}`, data);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update product');
    } finally {
      setSaving(false);
    }
  };
 
  // ─── Skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0" />
              <div className="h-8 w-32 bg-gray-100 rounded-lg" />
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-lg" />
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="h-4 w-24 bg-gray-100 rounded mb-3" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
 
        {/* Back */}
        <button
          onClick={() => navigate('/admin/products')}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 transition"
        >
          ← Back to products
        </button>
 
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Edit product</h1>
 
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        <form onSubmit={handleSubmit} className="space-y-5">
 
          {/* ── Image ─────────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product image
            </label>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                    🖼
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="cursor-pointer inline-block text-sm px-4 py-2 border
                                  border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                  Change image
                  <input
                    type="file"
                    accept="image/jpg,image/jpeg,image/png,image/webp"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-400">JPG, PNG or WebP · max 5MB</p>
                {form.image && (
                  <p className="text-xs text-green-600">✓ New image selected</p>
                )}
              </div>
            </div>
          </div>
 
          {/* ── Basic info ────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
 
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Product name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
              />
            </div>
 
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional product description"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition resize-none"
              />
            </div>
 
            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Rs.) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                             focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                             focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
                />
              </div>
            </div>
          </div>
 
          {/* ── Categories ────────────────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories <span className="text-red-400">*</span>
            </label>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-400">No categories available</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`text-sm px-3 py-1.5 rounded-lg border transition
                      ${form.categoryIds.includes(cat.id)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'border-gray-300 text-gray-700 hover:border-gray-500'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
            {form.categoryIds.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {form.categoryIds.length} selected
              </p>
            )}
          </div>
 
          {/* ── Actions ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-medium
                         rounded-lg hover:bg-gray-700 disabled:opacity-50
                         disabled:cursor-not-allowed transition"
            >
              {saving ? 'Saving changes...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm
                         font-medium rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
 
        </form>
      </div>
    </div>
  );
}