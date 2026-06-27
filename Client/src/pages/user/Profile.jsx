import { useState, useEffect } from 'react';
import api from '../../api/axios';
 
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', zip: '', country: '' });
 
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [addressMsg, setAddressMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [addressErr, setAddressErr] = useState('');
 
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
 
  // ─── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([api.get('/me'), api.get('/me/address')])
      .then(([profileRes, addressRes]) => {
        const p = profileRes.data.profile || profileRes.data;
        const a = addressRes.data.address || null;
        setProfile(p);
        setProfileForm({ username: p.username || '', email: p.email || '' });
        setAddress(a);
        if (a) setAddressForm({
          street: a.street || '',
          city: a.city || '',
          state: a.state || '',
          zip: a.zip || '',
          country: a.country || ''
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
  // ─── Update profile ──────────────────────────────────────────────────────────
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileErr('');
    setProfileMsg('');
    try {
      const res = await api.post('/me', {profileForm});
      setProfile(res.data.profile || res.data);
      setProfileMsg('Profile updated successfully');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };
 
  // ─── Change password ─────────────────────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirm) {
      return setPasswordErr('New passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordErr('Password must be at least 6 characters');
    }
    setSavingPassword(true);
    setPasswordErr('');
    setPasswordMsg('');
    try {
      await api.post('/me/password', {
        oldPass: passwordForm.oldPassword,
        newPass: passwordForm.newPassword
      });
      setPasswordMsg('Password changed successfully');
      setPasswordForm({ oldPassword: '', newPassword: '', confirm: '' });
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) {
      setPasswordErr(err.response?.data?.message || 'Could not change password');
    } finally {
      setSavingPassword(false);
    }
  };
 
  // ─── Update address ──────────────────────────────────────────────────────────
  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressErr('');
    setAddressMsg('');
    try {
      const res = await api.post('/me/address',{address : addressForm});
      setAddress(res.data.address || addressForm);
      setAddressMsg('Address saved successfully');
      setTimeout(() => setAddressMsg(''), 3000);
    } catch (err) {
      setAddressErr(err.response?.data?.message || 'Could not save address');
    } finally {
      setSavingAddress(false);
    }
  };
 
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/4 mb-5" />
              <div className="space-y-3">
                <div className="h-8 bg-gray-100 rounded" />
                <div className="h-8 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
 
  const inputClass = `w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none
                      focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
 
        <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
 
        {/* ── Profile info ───────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Account details</h2>
 
          {profileMsg && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {profileMsg}
            </div>
          )}
          {profileErr && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {profileErr}
            </div>
          )}
 
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className={labelClass}>Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={e => setProfileForm(f => ({ ...f, username: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-400">
                Role: <span className="font-medium capitalize">{profile?.role}</span>
              </p>
              <button
                type="submit"
                disabled={savingProfile}
                className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg
                           hover:bg-gray-700 disabled:opacity-50 transition"
              >
                {savingProfile ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
 
        {/* ── Change password ─────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Change password</h2>
 
          {passwordMsg && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {passwordMsg}
            </div>
          )}
          {passwordErr && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {passwordErr}
            </div>
          )}
 
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className={labelClass}>Current password</label>
              <input
                type="password"
                value={passwordForm.oldPassword}
                onChange={e => setPasswordForm(f => ({ ...f, oldPassword: e.target.value }))}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>New password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="Min. 6 characters"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirm new password</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={savingPassword}
                className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg
                           hover:bg-gray-700 disabled:opacity-50 transition"
              >
                {savingPassword ? 'Changing...' : 'Change password'}
              </button>
            </div>
          </form>
        </div>
 
        {/* ── Delivery address ────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Delivery address</h2>
 
          {addressMsg && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {addressMsg}
            </div>
          )}
          {addressErr && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {addressErr}
            </div>
          )}
 
          <form onSubmit={handleAddressUpdate} className="space-y-4">
            <div>
              <label className={labelClass}>Street</label>
              <input
                type="text"
                value={addressForm.street}
                onChange={e => setAddressForm(f => ({ ...f, street: e.target.value }))}
                placeholder="House 5, Block B, Gulshan"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={e => setAddressForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="Karachi"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={e => setAddressForm(f => ({ ...f, state: e.target.value }))}
                  placeholder="Sindh"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>ZIP</label>
                <input
                  type="text"
                  value={addressForm.zip}
                  onChange={e => setAddressForm(f => ({ ...f, zip: e.target.value }))}
                  placeholder="75300"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={addressForm.country}
                  onChange={e => setAddressForm(f => ({ ...f, country: e.target.value }))}
                  placeholder="Pakistan"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={savingAddress}
                className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg
                           hover:bg-gray-700 disabled:opacity-50 transition"
              >
                {savingAddress ? 'Saving...' : 'Save address'}
              </button>
            </div>
          </form>
        </div>
 
      </div>
    </div>
  );
}