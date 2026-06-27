import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', categoryIds: [], image: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  useEffect(() => {
    api.get('/products/categories')
      .then(res => setCategories(res.data.categories || []))
      .catch(() => {});
  }, []);
 
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
 
  const toggleCategory = (id) => {
    setForm(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter(c => c !== id)
        : [...f.categoryIds, id]
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.categoryIds.length === 0) return setError('Select at least one category');
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('stock', form.stock);
      data.append('categoryIds', JSON.stringify(form.categoryIds));
      if (form.image) data.append('image', form.image);
      await api.post('/products/addproduct', data);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add product');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
 
        <button onClick={() => navigate('/admin/products')}
          className="text-sm text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1 transition">
          ← Back to products
        </button>
 
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Add product</h1>
 
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        <form onSubmit={handleSubmit} className="space-y-5">
 
          {/* Image upload */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">Product image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🖼</div>
                )}
              </div>
              <label className="cursor-pointer text-sm px-4 py-2 border border-gray-300 rounded-lg
                                text-gray-700 hover:bg-gray-100 transition">
                Choose image
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            </div>
          </div>
 
          {/* Basic info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required
                placeholder="Product name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="Optional description"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange}
                  required min="0" step="0.01" placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                             focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange}
                  required min="0" placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                             focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition" />
              </div>
            </div>
          </div>
 
          {/* Categories */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categories <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.length > 0 && categories.map(cat => (
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
          </div>
 
          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg
                       hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
            {loading ? 'Adding product...' : 'Add product'}
          </button>
        </form>
      </div>
    </div>
  );
}
 