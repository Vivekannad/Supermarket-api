import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
 
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
 
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
 
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold tracking-tight text-gray-900">
            Supermarket
          </span>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
        </div>
 
        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
 
          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
 
          <form onSubmit={handleSubmit} className="space-y-4">
 
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
              />
            </div>
 
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
              />
            </div>
 
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium
                         rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
 
          </form>
        </div>
 
        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-gray-900 font-medium hover:underline">
            Register
          </Link>
        </p>
 
      </div>
    </div>
  );
}