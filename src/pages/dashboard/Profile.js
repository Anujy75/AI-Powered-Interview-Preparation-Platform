import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  RiUserLine, RiMailLine, RiBriefcaseLine,
  RiCameraLine, RiSaveLine, RiDeleteBinLine,
  RiShieldLine, RiLockLine, RiCheckLine
} from 'react-icons/ri';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name cannot be empty');
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API}/api/users/profile`,
        { name: formData.name },
        { withCredentials: true }
      );
      setUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');

    const form = new FormData();
    form.append('avatar', file);
    setAvatarLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/users/avatar`, form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(data.user);
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Avatar upload failed');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar) return;
    setAvatarLoading(true);
    try {
      const { data } = await axios.delete(`${API}/api/users/avatar`, { withCredentials: true });
      setUser(data.user);
      toast.success('Avatar removed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return toast.error('All fields are required');
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwords.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setPasswordLoading(true);
    try {
      await axios.put(
        `${API}/api/users/change-password`,
        { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
        { withCredentials: true }
      );
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const avatarSrc = user?.avatar ? `${API}${user.avatar}` : null;
  const initials = user?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Avatar Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            {avatarLoading && (
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Info + Actions */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-lg truncate">{user?.name}</p>
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={avatarLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition-colors disabled:opacity-50"
              >
                <RiCameraLine size={14} />
                Change Photo
              </button>
              {user?.avatar && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={avatarLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition-colors disabled:opacity-50"
                >
                  <RiDeleteBinLine size={14} />
                  Remove
                </button>
              )}
            </div>
            <p className="text-gray-500 text-xs mt-2">JPG, PNG up to 2MB</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
        {[
          { id: 'profile', label: 'Profile Info', icon: RiUserLine },
          { id: 'security', label: 'Security', icon: RiShieldLine },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Profile Info Tab */}
      {activeTab === 'profile' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Personal Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Full Name</label>
              <div className="relative">
                <RiUserLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Email Address</label>
              <div className="relative">
                <RiMailLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* Role (read-only) */}
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Role</label>
              <div className="relative">
                <RiBriefcaseLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={formData.role}
                  readOnly
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-gray-400 text-sm cursor-not-allowed capitalize"
                />
              </div>
            </div>

            {/* Email verification status */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              user?.isEmailVerified
                ? 'bg-green-500/10 text-green-400'
                : 'bg-yellow-500/10 text-yellow-400'
            }`}>
              {user?.isEmailVerified
                ? <><RiCheckLine size={15} /> Email verified</>
                : <>⚠️ Email not verified — check your inbox</>
              }
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <RiSaveLine size={16} />
              }
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">

            {[
              { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
              { name: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
              { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
            ].map(({ name, label, placeholder }) => (
              <div key={name}>
                <label className="block text-gray-400 text-sm mb-1.5">{label}</label>
                <div className="relative">
                  <RiLockLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    name={name}
                    value={passwords[name]}
                    onChange={handlePasswordChange}
                    placeholder={placeholder}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={passwordLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passwordLoading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <RiShieldLine size={16} />
              }
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Profile;