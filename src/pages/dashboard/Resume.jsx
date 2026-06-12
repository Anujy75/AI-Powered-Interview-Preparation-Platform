import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ResumeUpload from '../../components/ResumeUpload';

function Resume() {
  const { user, updateUser } = useAuth();

  if (!user) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '300px', color: '#475569',
      fontFamily: "'DM Sans', sans-serif", fontSize: '14px', gap: '10px'
    }}>
      <div style={{
        width: 18, height: 18,
        border: '2px solid rgba(59,130,246,0.2)',
        borderTop: '2px solid #3B82F6',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite'
      }} />
      Loading resume data…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <ResumeUpload user={user} setUser={updateUser} />
  );
}

export default Resume;