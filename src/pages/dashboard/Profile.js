import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  RiUserLine, RiMailLine, RiBriefcaseLine,
  RiCameraLine, RiSaveLine, RiDeleteBinLine,
  RiShieldLine, RiLockLine,
  RiEyeLine, RiEyeOffLine, RiEditLine,
  RiVerifiedBadgeLine, RiAlertLine
} from 'react-icons/ri';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* ─────────────── Styles ─────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  :root {
    --bg-primary: #0A0E1A;
    --bg-secondary: #0F1629;
    --bg-card: #111827;
    --bg-card-hover: #141e30;
    --bg-input: #0d1424;
    --bg-hover: #1a2235;
    --accent: #3B82F6;
    --accent-dim: rgba(59,130,246,0.12);
    --accent-border: rgba(59,130,246,0.25);
    --accent-glow: rgba(59,130,246,0.35);
    --accent-2: #06B6D4;
    --accent-3: #8B5CF6;
    --success: #10B981;
    --success-dim: rgba(16,185,129,0.12);
    --warning: #F59E0B;
    --warning-dim: rgba(245,158,11,0.12);
    --danger: #F87171;
    --danger-dim: rgba(248,113,113,0.1);
    --text-primary: #F1F5F9;
    --text-secondary: #94A3B8;
    --text-muted: #475569;
    --border: rgba(148,163,184,0.08);
    --border-focus: rgba(59,130,246,0.4);
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 14px;
    --radius-sm: 10px;
    --radius-xs: 8px;
  }

  .profile-root {
    max-width: 760px;
    margin: 0 auto;
    font-family: var(--font-body);
    color: var(--text-primary);
    padding-bottom: 48px;
  }
  .profile-header { margin-bottom: 28px; animation: fadeUp 0.4s ease both; }
  .profile-header h1 {
    font-family: var(--font-display);
    font-size: 26px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, #F1F5F9 30%, var(--accent-2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; line-height: 1.2; margin: 0;
  }
  .profile-header p { color: var(--text-muted); font-size: 13.5px; margin-top: 5px; }
  .avatar-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 28px; margin-bottom: 20px;
    position: relative; overflow: hidden; animation: fadeUp 0.4s 0.05s ease both;
  }
  .avatar-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 5%, var(--accent) 50%, transparent 95%); opacity: 0.5;
  }
  .avatar-card-bg {
    position: absolute; top: -60px; right: -60px; width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(59,130,246,0.06), transparent 70%); pointer-events: none;
  }
  .avatar-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .avatar-wrap { position: relative; flex-shrink: 0; }
  .avatar-ring {
    width: 88px; height: 88px; border-radius: 50%; padding: 3px;
    background: linear-gradient(135deg, var(--accent), var(--accent-3)); position: relative;
  }
  .avatar-inner {
    width: 100%; height: 100%; border-radius: 50%;
    background: linear-gradient(135deg, #1e3a5f, var(--accent-3));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 28px; font-weight: 800;
    color: white; overflow: hidden; border: 2px solid var(--bg-card);
  }
  .avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-overlay {
    position: absolute; inset: 0; border-radius: 50%;
    background: rgba(0,0,0,0.55); display: flex; align-items: center;
    justify-content: center; backdrop-filter: blur(2px);
  }
  .avatar-spinner {
    width: 22px; height: 22px; border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  .online-badge {
    position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px;
    background: var(--success); border-radius: 50%; border: 2.5px solid var(--bg-card);
    box-shadow: 0 0 8px rgba(16,185,129,0.5);
  }
  .avatar-info { flex: 1; min-width: 0; }
  .avatar-info-name {
    font-family: var(--font-display); font-size: 19px; font-weight: 700;
    color: var(--text-primary); white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; letter-spacing: -0.3px;
  }
  .avatar-info-email { font-size: 13px; color: var(--text-muted); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .role-pill {
    display: inline-flex; align-items: center; gap: 5px; margin-top: 8px;
    padding: 3px 10px; background: var(--accent-dim); border: 1px solid var(--accent-border);
    border-radius: 20px; font-size: 11px; font-weight: 600; color: var(--accent);
    letter-spacing: 0.5px; text-transform: uppercase;
  }
  .avatar-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  .btn-photo {
    display: flex; align-items: center; gap: 7px; padding: 8px 16px;
    background: var(--accent); color: white; border: none; border-radius: var(--radius-xs);
    font-size: 12.5px; font-weight: 600; font-family: var(--font-body); cursor: pointer;
    transition: all 0.2s; box-shadow: 0 4px 14px rgba(59,130,246,0.3);
  }
  .btn-photo:hover { background: #2563eb; box-shadow: 0 4px 20px rgba(59,130,246,0.45); transform: translateY(-1px); }
  .btn-photo:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }
  .btn-remove {
    display: flex; align-items: center; gap: 7px; padding: 8px 14px;
    background: var(--danger-dim); color: var(--danger); border: 1px solid rgba(248,113,113,0.18);
    border-radius: var(--radius-xs); font-size: 12.5px; font-weight: 600;
    font-family: var(--font-body); cursor: pointer; transition: all 0.2s;
  }
  .btn-remove:hover { background: rgba(248,113,113,0.18); transform: translateY(-1px); }
  .btn-remove:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }
  .file-hint { font-size: 11px; color: var(--text-muted); margin-top: 8px; }
  .tab-bar {
    display: flex; gap: 4px; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 5px; margin-bottom: 20px;
    animation: fadeUp 0.4s 0.1s ease both;
  }
  .tab-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 9px 16px; border-radius: var(--radius-xs); border: 1px solid transparent;
    background: none; font-family: var(--font-body); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; color: var(--text-muted);
  }
  .tab-btn:hover { color: var(--text-secondary); background: var(--bg-hover); }
  .tab-btn.active { background: var(--accent-dim); border-color: var(--accent-border); color: var(--accent); }
  .form-card {
    background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 28px; animation: fadeUp 0.35s ease both; position: relative; overflow: hidden;
  }
  .form-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent);
  }
  .form-card-header {
    display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
    padding-bottom: 18px; border-bottom: 1px solid var(--border);
  }
  .form-card-icon {
    width: 36px; height: 36px; border-radius: var(--radius-xs);
    background: var(--accent-dim); border: 1px solid var(--accent-border);
    display: flex; align-items: center; justify-content: center; color: var(--accent);
  }
  .form-card-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text-primary); }
  .form-card-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
  .field-group { margin-bottom: 18px; }
  .field-label {
    display: block; font-size: 12px; font-weight: 600; color: var(--text-secondary);
    letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 7px;
  }
  .field-wrap { position: relative; display: flex; align-items: center; }
  .field-icon { position: absolute; left: 13px; color: var(--text-muted); display: flex; pointer-events: none; }
  .field-input {
    width: 100%; background: var(--bg-input); border: 1px solid rgba(148,163,184,0.1);
    border-radius: var(--radius-xs); padding: 11px 14px 11px 40px; color: var(--text-primary);
    font-size: 14px; font-family: var(--font-body); transition: all 0.2s; outline: none;
  }
  .field-input::placeholder { color: var(--text-muted); }
  .field-input:focus { border-color: var(--border-focus); background: var(--bg-card); box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
  .field-input.readonly { color: var(--text-muted); cursor: not-allowed; opacity: 0.7; }
  .field-hint { font-size: 11.5px; color: var(--text-muted); margin-top: 5px; display: flex; align-items: center; gap: 4px; }
  .pass-toggle {
    position: absolute; right: 12px; background: none; border: none;
    color: var(--text-muted); cursor: pointer; padding: 4px; display: flex;
    border-radius: 6px; transition: color 0.2s;
  }
  .pass-toggle:hover { color: var(--text-secondary); }
  .status-badge {
    display: flex; align-items: center; gap: 8px; padding: 10px 14px;
    border-radius: var(--radius-xs); font-size: 13px; font-weight: 500; margin-bottom: 18px;
  }
  .status-badge.verified { background: var(--success-dim); border: 1px solid rgba(16,185,129,0.2); color: var(--success); }
  .status-badge.unverified { background: var(--warning-dim); border: 1px solid rgba(245,158,11,0.2); color: var(--warning); }
  .strength-bar { display: flex; gap: 4px; margin-top: 8px; }
  .strength-seg { flex: 1; height: 3px; border-radius: 2px; background: var(--bg-hover); transition: background 0.3s; }
  .strength-seg.weak { background: var(--danger); }
  .strength-seg.medium { background: var(--warning); }
  .strength-seg.strong { background: var(--success); }
  .strength-label { font-size: 11px; margin-top: 5px; font-weight: 600; }
  .strength-label.weak { color: var(--danger); }
  .strength-label.medium { color: var(--warning); }
  .strength-label.strong { color: var(--success); }
  .divider { height: 1px; background: var(--border); margin: 22px 0; }
  .btn-submit {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 22px;
    background: var(--accent); color: white; border: none; border-radius: var(--radius-xs);
    font-size: 13.5px; font-weight: 600; font-family: var(--font-body); cursor: pointer;
    transition: all 0.2s; box-shadow: 0 4px 14px rgba(59,130,246,0.3);
    position: relative; overflow: hidden;
  }
  .btn-submit::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent); }
  .btn-submit:hover:not(:disabled) { background: #2563eb; box-shadow: 0 4px 22px rgba(59,130,246,0.5); transform: translateY(-1px); }
  .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .btn-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
  .security-tips { background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--radius-xs); padding: 14px 16px; margin-top: 6px; }
  .security-tips-title { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; }
  .security-tip { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-muted); margin-bottom: 5px; }
  .tip-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  return s;
};

const PasswordField = ({ name, label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="field-wrap">
        <span className="field-icon"><RiLockLine size={16} /></span>
        <input
          type={show ? 'text' : 'password'}
          name={name} value={value} onChange={onChange}
          placeholder={placeholder} className="field-input"
          style={{ paddingRight: 42 }}
        />
        <button type="button" className="pass-toggle" onClick={() => setShow(s => !s)}>
          {show ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
        </button>
      </div>
    </div>
  );
};

const Profile = () => {
  // ✅ Fix 1: setUser → updateUser
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', email: user.email || '', role: user.role || '' });
  }, [user]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePasswordChange = e => setPasswords(p => ({ ...p, [e.target.name]: e.target.value }));

  // ✅ Fix 2: endpoint + updateUser
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error('Name cannot be empty');
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API}/profile`,
        { name: formData.name },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  // ✅ Fix 3: endpoint + updateUser
const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
  if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');
  
  const form = new FormData();
  form.append('avatar', file);
  setAvatarLoading(true);
  
  try {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // ← ye check karo
    
    const { data } = await axios.post(
      `${API}/profile/avatar`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    updateUser(data.user);
    toast.success('Avatar updated!');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Upload failed');
  } finally { setAvatarLoading(false); }
};
  // ✅ Fix 4: endpoint + updateUser
  const handleDeleteAvatar = async () => {
    if (!user?.avatar) return;
    setAvatarLoading(true);
    try {
      const { data } = await axios.delete(
        `${API}/profile/avatar`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      updateUser(data.user);
      toast.success('Avatar removed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to remove');
    } finally { setAvatarLoading(false); }
  };

  // ✅ Fix 5: endpoint
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword)
      return toast.error('All fields are required');
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error('Passwords do not match');
    if (passwords.newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');
    setPasswordLoading(true);
    try {
      await axios.put(
        `${API}/profile/change-password`,
        { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Password updated!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update password');
    } finally { setPasswordLoading(false); }
  };

  const avatarSrc = user?.avatar ? `http://localhost:5000${user.avatar}` : null;
  console.log('Avatar URL:', avatarSrc); 
  const initials = user?.name?.charAt(0).toUpperCase() || '?';
  const strength = getStrength(passwords.newPassword);
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];
  const strengthClass = ['', 'weak', 'medium', 'strong'];

  return (
    <>
      <style>{styles}</style>
      <div className="profile-root">
        <div className="profile-header">
          <h1>Account Settings</h1>
          <p>Manage your identity, security, and preferences</p>
        </div>

        <div className="avatar-card">
          <div className="avatar-card-bg" />
          <div className="avatar-row">
            <div className="avatar-wrap">
              <div className="avatar-ring">
                <div className="avatar-inner">
                  {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : initials}
                </div>
              </div>
              {avatarLoading && (
                <div className="avatar-overlay" style={{ position: 'absolute', inset: 0, borderRadius: '50%' }}>
                  <div className="avatar-spinner" />
                </div>
              )}
              <div className="online-badge" />
            </div>
            <div className="avatar-info">
              <div className="avatar-info-name">{user?.name || 'Your Name'}</div>
              <div className="avatar-info-email">{user?.email}</div>
              <div className="role-pill">
                <RiBriefcaseLine size={11} />
                {user?.role || 'User'}
              </div>
              <div className="avatar-actions">
                <button className="btn-photo" onClick={() => fileInputRef.current.click()} disabled={avatarLoading}>
                  <RiCameraLine size={14} />
                  {avatarLoading ? 'Uploading…' : 'Change Photo'}
                </button>
                {user?.avatar && (
                  <button className="btn-remove" onClick={handleDeleteAvatar} disabled={avatarLoading}>
                    <RiDeleteBinLine size={14} />
                    Remove
                  </button>
                )}
              </div>
              <p className="file-hint">JPG or PNG · Max 2MB</p>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>

        <div className="tab-bar">
          {[
            { id: 'profile', label: 'Personal Info', icon: RiEditLine },
            { id: 'security', label: 'Security', icon: RiShieldLine },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} className={`tab-btn ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-icon"><RiUserLine size={17} /></div>
              <div>
                <div className="form-card-title">Personal Information</div>
                <div className="form-card-sub">Update your name and view account details</div>
              </div>
            </div>
            <div className={`status-badge ${user?.isEmailVerified ? 'verified' : 'unverified'}`}>
              {user?.isEmailVerified
                ? <><RiVerifiedBadgeLine size={16} /> Email verified — your account is active</>
                : <><RiAlertLine size={16} /> Email not verified — check your inbox to verify</>
              }
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <div className="field-wrap">
                  <span className="field-icon"><RiUserLine size={16} /></span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className="field-input" />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-wrap">
                  <span className="field-icon"><RiMailLine size={16} /></span>
                  <input type="email" value={formData.email} readOnly className="field-input readonly" />
                </div>
                <p className="field-hint">🔒 Email address cannot be changed</p>
              </div>
              <div className="field-group">
                <label className="field-label">Account Role</label>
                <div className="field-wrap">
                  <span className="field-icon"><RiBriefcaseLine size={16} /></span>
                  <input type="text" value={formData.role} readOnly className="field-input readonly" style={{ textTransform: 'capitalize' }} />
                </div>
                <p className="field-hint">Assigned by system · Contact admin to change</p>
              </div>
              <div className="divider" />
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <div className="btn-spinner" /> : <RiSaveLine size={16} />}
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="form-card">
            <div className="form-card-header">
              <div className="form-card-icon" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
                <RiShieldLine size={17} />
              </div>
              <div>
                <div className="form-card-title">Change Password</div>
                <div className="form-card-sub">Keep your account secure with a strong password</div>
              </div>
            </div>
            <form onSubmit={handleChangePassword}>
              <PasswordField name="currentPassword" label="Current Password" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="Enter your current password" />
              <PasswordField name="newPassword" label="New Password" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="Minimum 6 characters" />
              {passwords.newPassword && (
                <div style={{ marginTop: -10, marginBottom: 18 }}>
                  <div className="strength-bar">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`strength-seg ${i <= strength ? strengthClass[strength] : ''}`} />
                    ))}
                  </div>
                  <div className={`strength-label ${strengthClass[strength]}`}>{strengthLabels[strength]} password</div>
                </div>
              )}
              <PasswordField name="confirmPassword" label="Confirm New Password" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="Repeat your new password" />
              {passwords.confirmPassword && (
                <div style={{ marginTop: -10, marginBottom: 18, fontSize: 12, fontWeight: 600, color: passwords.newPassword === passwords.confirmPassword ? 'var(--success)' : 'var(--danger)' }}>
                  {passwords.newPassword === passwords.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
              <div className="divider" />
              <div className="security-tips">
                <div className="security-tips-title">Tips for a strong password</div>
                {['Use at least 10 characters', 'Mix uppercase, numbers & symbols', 'Avoid using your name or email', "Don't reuse passwords from other sites"].map(tip => (
                  <div className="security-tip" key={tip}><div className="tip-dot" />{tip}</div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <button type="submit" className="btn-submit" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }} disabled={passwordLoading}>
                  {passwordLoading ? <div className="btn-spinner" /> : <RiShieldLine size={16} />}
                  {passwordLoading ? 'Updating…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;