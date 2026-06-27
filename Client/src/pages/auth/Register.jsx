import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";


export default function Register() {
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
 
    setLoading(true);
    try {
      await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
 
        {/* Brand */}
        <div className="mb-8 text-center">
          <span className="text-2xl font-semibold tracking-tight text-gray-900">
            Supermarket
          </span>
          <p className="mt-1 text-sm text-gray-500">Create your account</p>
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
 
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="vivek123"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
              />
            </div>
 
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
                placeholder="Min. 6 characters"
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                           focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition"
              />
            </div>
 
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
 
          </form>
        </div>
 
        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>
 
      </div>
    </div>
  );
}