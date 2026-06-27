import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
 
export default function AdminUsers() {
  const navigate = useNavigate();
 
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
 
  // ─── Fetch all users ─────────────────────────────────────────────────────────
  useEffect(() => {
    api.get('/admin/users')
      .then(res => {
        const data = res.data.users || res.data || [];
        setUsers(data);
        setFiltered(data);
      })
      .catch(() => setError('Could not load users'))
      .finally(() => setLoading(false));
  }, []);
 
  // ─── Search filter ───────────────────────────────────────────────────────────
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(u =>
        u.username?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      )
    );
  }, [search, users]);
 
  // ─── Fetch user detail ───────────────────────────────────────────────────────
  const handleViewUser = async (userId) => {
    setDetailLoading(true);
    setSelectedUser(null);
    try {
      const res = await api.get(`/admin/user/${userId}`);
      setSelectedUser(res.data.user || res.data);
    } catch {
      setError('Could not load user details');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDetailLoading(false);
    }
  };
 
  // ─── Skeleton ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
          <div className="h-9 w-64 bg-gray-200 rounded-lg mb-5" />
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
                <div className="w-9 h-9 bg-gray-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-6 w-12 bg-gray-100 rounded-full" />
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
 
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="text-sm text-gray-400 mt-0.5">{users.length} total accounts</p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Dashboard
          </button>
        </div>
 
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
 
        <div className="flex flex-col lg:flex-row gap-6">
 
          {/* ── Left — users list ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
 
            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by username or email..."
              className="w-full mb-4 px-4 py-2 text-sm border border-gray-300 rounded-lg
                         outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900
                         transition bg-white"
            />
 
            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {filtered.length === 0 ? (
                <div className="py-14 text-center">
                  <span className="text-4xl">👥</span>
                  <p className="mt-3 text-sm font-medium text-gray-900">No users found</p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-2 text-xs text-gray-500 underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Table header */}
                  <div className="hidden sm:grid grid-cols-12 px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="col-span-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</p>
                    <p className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="col-span-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</p>
                    <p className="col-span-1" />
                  </div>
 
                  <div className="divide-y divide-gray-100">
                    {filtered.map(user => (
                      <div
                        key={user.id}
                        onClick={() => handleViewUser(user.id)}
                        className={`flex sm:grid sm:grid-cols-12 items-center gap-3 px-5 py-3.5
                                    cursor-pointer transition hover:bg-gray-50
                                    ${selectedUser?.id === user.id ? 'bg-gray-50 border-l-2 border-l-gray-900' : ''}`}
                      >
                        {/* Avatar + username */}
                        <div className="col-span-5 flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center
                                          justify-center shrink-0 text-sm font-semibold text-gray-600">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {user.username}
                          </span>
                        </div>
 
                        {/* Email */}
                        <p className="col-span-4 text-sm text-gray-500 truncate hidden sm:block">
                          {user.email}
                        </p>
 
                        {/* Role badge */}
                        <div className="col-span-2 hidden sm:block">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize
                            ${user.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {user.role}
                          </span>
                        </div>
 
                        {/* Arrow */}
                        <div className="col-span-1 flex justify-end">
                          <span className="text-gray-300 text-sm">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
 
          {/* ── Right — user detail panel ────────────────────────────────── */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-20">
 
              {detailLoading ? (
                <div className="p-6 animate-pulse space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                  <div className="space-y-3 pt-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-3 bg-gray-100 rounded" />
                    ))}
                  </div>
                </div>
              ) : selectedUser ? (
                <>
                  {/* Profile section */}
                  <div className="p-6 border-b border-gray-100 text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center
                                    text-xl font-bold text-gray-600 mx-auto mb-3">
                      {selectedUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{selectedUser.username}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedUser.email}</p>
                    <span className={`mt-2 inline-block text-xs font-medium px-2.5 py-0.5
                                      rounded-full border capitalize
                      ${selectedUser.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {selectedUser.role}
                    </span>
                  </div>
 
                  {/* Details */}
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        User ID
                      </p>
                      <p className="text-sm text-gray-700">#{selectedUser.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        Member since
                      </p>
                      <p className="text-sm text-gray-700">
                        {selectedUser.created_at
                          ? new Date(selectedUser.created_at).toLocaleDateString('en-PK', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            })
                          : '—'}
                      </p>
                    </div>
                    {selectedUser.address && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          Address
                        </p>
                        <address className="text-sm text-gray-700 not-italic leading-relaxed">
                          {selectedUser.address.street}<br />
                          {selectedUser.address.city}, {selectedUser.address.state}<br />
                          {selectedUser.address.country}
                        </address>
                      </div>
                    )}
                  </div>
 
                  {/* Close button */}
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="w-full py-2 border border-gray-200 text-sm text-gray-500
                                 rounded-lg hover:bg-gray-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <span className="text-4xl">👤</span>
                  <p className="mt-3 text-sm font-medium text-gray-900">Select a user</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click any row to view user details
                  </p>
                </div>
              )}
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}
 