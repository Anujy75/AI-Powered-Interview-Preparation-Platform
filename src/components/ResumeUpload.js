import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  RiUploadCloud2Line, RiFileTextLine, RiDeleteBinLine,
  RiDownloadLine, RiEyeLine, RiCheckboxCircleLine,
  RiErrorWarningLine, RiFilePdf2Line,
  RiShieldCheckLine, RiTimeLine, RiBarChartLine,
} from 'react-icons/ri';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/* ─────────────── Styles ─────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg-primary: #0A0E1A;
    --bg-secondary: #0F1629;
    --bg-card: #111827;
    --bg-input: #0d1424;
    --bg-hover: #1a2235;
    --accent: #3B82F6;
    --accent-dim: rgba(59,130,246,0.1);
    --accent-border: rgba(59,130,246,0.25);
    --accent-glow: rgba(59,130,246,0.4);
    --accent-2: #06B6D4;
    --accent-3: #8B5CF6;
    --success: #10B981;
    --success-dim: rgba(16,185,129,0.1);
    --success-border: rgba(16,185,129,0.2);
    --warning: #F59E0B;
    --warning-dim: rgba(245,158,11,0.1);
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

  .resume-root {
    max-width: 760px;
    margin: 0 auto;
    font-family: var(--font-body);
    color: var(--text-primary);
    padding-bottom: 48px;
  }

  /* ── Page header ── */
  .resume-header {
    margin-bottom: 28px;
    animation: fadeUp 0.4s ease both;
  }

  .resume-header-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .resume-header h1 {
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #F1F5F9 30%, var(--accent-2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
    margin: 0;
  }

  .resume-header p {
    color: var(--text-muted);
    font-size: 13.5px;
    margin-top: 5px;
  }

  /* ── Drop zone ── */
  .drop-zone {
    position: relative;
    border: 2px dashed rgba(148,163,184,0.15);
    border-radius: var(--radius);
    background: var(--bg-card);
    padding: 52px 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    margin-bottom: 20px;
    overflow: hidden;
    animation: fadeUp 0.4s 0.05s ease both;
  }

  .drop-zone::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 5%, var(--accent) 50%, transparent 95%);
    opacity: 0.35;
    transition: opacity 0.3s;
  }

  /* Animated grid bg */
  .drop-zone-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    transition: opacity 0.3s;
    opacity: 0;
  }

  .drop-zone:hover .drop-zone-grid,
  .drop-zone.dragging .drop-zone-grid { opacity: 1; }

  .drop-zone:hover,
  .drop-zone.dragging {
    border-color: var(--accent-border);
    background: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(59,130,246,0.1), 0 0 0 1px var(--accent-border);
  }

  .drop-zone:hover::before,
  .drop-zone.dragging::before { opacity: 0.7; }

  .drop-zone.dragging {
    border-color: var(--accent);
    border-style: solid;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.1), 0 12px 40px rgba(59,130,246,0.2);
  }

  /* Drop zone content */
  .dz-icon-wrap {
    width: 72px; height: 72px;
    margin: 0 auto 20px;
    position: relative;
  }

  .dz-icon-bg {
    width: 100%; height: 100%;
    border-radius: 20px;
    background: var(--accent-dim);
    border: 1px solid var(--accent-border);
    display: flex; align-items: center; justify-content: center;
    transition: all 0.3s;
  }

  .drop-zone:hover .dz-icon-bg,
  .drop-zone.dragging .dz-icon-bg {
    background: rgba(59,130,246,0.18);
    box-shadow: 0 0 24px rgba(59,130,246,0.25);
    transform: scale(1.05);
  }

  .dz-icon-bg svg { color: var(--accent); transition: transform 0.3s; }
  .drop-zone.dragging .dz-icon-bg svg { transform: translateY(-3px); }

  .dz-pulse {
    position: absolute;
    inset: -6px;
    border-radius: 26px;
    border: 1.5px solid var(--accent-border);
    opacity: 0;
    animation: none;
  }

  .drop-zone.dragging .dz-pulse {
    opacity: 1;
    animation: pulse-ring 1.2s ease-out infinite;
  }

  .dz-title {
    font-family: var(--font-display);
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 6px;
  }

  .dz-sub {
    font-size: 13.5px;
    color: var(--text-muted);
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .dz-sub span { color: var(--accent); font-weight: 600; cursor: pointer; }
  .dz-sub span:hover { text-decoration: underline; }

  .dz-chips {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .dz-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: 20px;
    font-size: 11.5px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .dz-chip-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--success);
  }

  /* ── Upload progress ── */
  .upload-progress-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-bottom: 20px;
    animation: fadeUp 0.3s ease both;
  }

  .progress-file-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }

  .progress-file-icon {
    width: 44px; height: 44px;
    border-radius: var(--radius-xs);
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: #F87171;
  }

  .progress-file-info { flex: 1; min-width: 0; }
  .progress-file-name {
    font-size: 14px; font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .progress-file-size { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  .progress-pct {
    font-family: var(--font-display);
    font-size: 16px;
    font-weight: 700;
    color: var(--accent);
  }

  .progress-bar-track {
    height: 6px;
    background: var(--bg-input);
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .progress-bar-shimmer {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 60px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 1.2s linear infinite;
  }

  .progress-status {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .progress-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: blink 1s ease infinite;
  }

  /* ── Existing resume card ── */
  .resume-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.4s 0.1s ease both;
    transition: border-color 0.2s;
  }

  .resume-card:hover { border-color: rgba(148,163,184,0.15); }

  .resume-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--success), transparent);
    opacity: 0.4;
  }

  .resume-card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .resume-file-icon {
    width: 52px; height: 52px;
    border-radius: 12px;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: #F87171;
    position: relative;
  }

  .resume-file-badge {
    position: absolute;
    bottom: -4px; right: -4px;
    width: 18px; height: 18px;
    background: var(--success);
    border-radius: 50%;
    border: 2px solid var(--bg-card);
    display: flex; align-items: center; justify-content: center;
  }

  .resume-file-badge svg { width: 10px; height: 10px; color: white; }

  .resume-info { flex: 1; min-width: 0; }

  .resume-name {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .resume-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 5px;
    flex-wrap: wrap;
  }

  .resume-meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--text-muted);
  }

  .resume-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ATS Score section */
  .ats-section {
    background: var(--bg-input);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 18px 20px;
    margin-top: 4px;
  }

  .ats-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .ats-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 0.3px;
  }

  .ats-score-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 800;
  }

  .ats-score-badge.excellent {
    background: var(--success-dim);
    border: 1px solid var(--success-border);
    color: var(--success);
  }

  .ats-score-badge.good {
    background: var(--accent-dim);
    border: 1px solid var(--accent-border);
    color: var(--accent);
  }

  .ats-score-badge.fair {
    background: var(--warning-dim);
    border: 1px solid rgba(245,158,11,0.2);
    color: var(--warning);
  }

  .ats-score-badge.poor {
    background: var(--danger-dim);
    border: 1px solid rgba(248,113,113,0.18);
    color: var(--danger);
  }

  /* ATS metrics */
  .ats-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    .ats-metrics { grid-template-columns: 1fr; }
  }

  .ats-metric {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    padding: 12px 14px;
  }

  .ats-metric-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 5px;
  }

  .ats-metric-val {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    color: var(--text-primary);
  }

  .ats-metric-sub {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  /* ATS bar */
  .ats-bar-wrap { margin-bottom: 4px; }

  .ats-bar-label {
    display: flex;
    justify-content: space-between;
    font-size: 11.5px;
    color: var(--text-muted);
    margin-bottom: 5px;
  }

  .ats-bar-track {
    height: 5px;
    background: var(--bg-hover);
    border-radius: 3px;
    overflow: hidden;
  }

  .ats-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1s cubic-bezier(0.4,0,0.2,1);
  }

  /* Tips */
  .tips-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
    animation: fadeUp 0.4s 0.15s ease both;
  }

  @media (max-width: 560px) { .tips-grid { grid-template-columns: 1fr; } }

  .tip-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
    transition: border-color 0.2s;
  }

  .tip-card:hover { border-color: rgba(148,163,184,0.15); }

  .tip-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .tip-title {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--text-secondary);
    margin-bottom: 3px;
  }

  .tip-body {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* Action buttons */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: var(--radius-xs);
    font-size: 13px; font-weight: 600;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(59,130,246,0.3);
  }
  .btn-primary:hover:not(:disabled) {
    background: #2563eb;
    box-shadow: 0 4px 22px rgba(59,130,246,0.45);
    transform: translateY(-1px);
  }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 14px;
    background: var(--bg-hover);
    color: var(--text-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    font-size: 13px; font-weight: 600;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }
  .btn-ghost:hover {
    color: var(--text-primary);
    border-color: rgba(148,163,184,0.2);
    transform: translateY(-1px);
  }

  .btn-danger {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 14px;
    background: var(--danger-dim);
    color: var(--danger);
    border: 1px solid rgba(248,113,113,0.18);
    border-radius: var(--radius-xs);
    font-size: 13px; font-weight: 600;
    font-family: var(--font-body);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-danger:hover:not(:disabled) {
    background: rgba(248,113,113,0.18);
    transform: translateY(-1px);
  }
  .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .btn-spinner-dark {
    width: 14px; height: 14px;
    border: 2px solid rgba(148,163,184,0.3);
    border-top-color: var(--text-secondary);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* Replace resume banner */
  .replace-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: var(--warning-dim);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: var(--radius-xs);
    margin-bottom: 20px;
    font-size: 13px;
    color: var(--warning);
    flex-wrap: wrap;
    animation: fadeUp 0.3s ease both;
  }

  .replace-banner-left { display: flex; align-items: center; gap: 8px; }

  /* Animations */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer {
    from { transform: translateX(-100%); }
    to { transform: translateX(200%); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.15); opacity: 0; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes ats-fill {
    from { width: 0; }
  }
`;

/* ─────────────── Helpers ─────────────── */
const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getATSClass = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
};

const getATSLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
};

const atsBarColor = (score) => {
  if (score >= 80) return 'var(--success)';
  if (score >= 60) return 'var(--accent)';
  if (score >= 40) return 'var(--warning)';
  return 'var(--danger)';
};

/* ─────────────── Component ─────────────── */
const ResumeUpload = ({ user, setUser }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFile, setUploadingFile] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [atsAnimated, setAtsAnimated] = useState(false);
  const fileInputRef = useRef();
  const dragCounter = useRef(0);

  // Trigger ATS bar animation when resume card is visible
  useEffect(() => {
    if (user?.resume) {
      const t = setTimeout(() => setAtsAnimated(true), 400);
      return () => clearTimeout(t);
    }
  }, [user?.resume]);

  /* Mock ATS score derived from file metadata */
  const atsScore = user?.resume ? 72 : 0;
  const atsMetrics = [
    { label: 'Keywords', value: '18/24', sub: 'matched' },
    { label: 'Format', value: '94%', sub: 'compatibility' },
    { label: 'Sections', value: '7/8', sub: 'detected' },
  ];
  const atsBars = [
    { label: 'Skills Match', score: 78 },
    { label: 'Experience', score: 85 },
    { label: 'Education', score: 90 },
    { label: 'Keywords', score: 65 },
  ];

  /* ── Drag & Drop handlers ── */
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items?.length > 0) setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    dragCounter.current = 0;
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── File processing ── */
  const processFile = (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    uploadResume(file);
  };

  const uploadResume = async (file) => {
    const form = new FormData();
    form.append('resume', file);
    setUploadingFile({ name: file.name, size: file.size });
    setUploading(true);
    setUploadProgress(0);

    try {
     const { data } = await axios.post(`${API}/resume`, form, {
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(pct);
        },
      });
      setUser(data.user);
      toast.success('Resume uploaded successfully!');
      setAtsAnimated(false);
      setTimeout(() => setAtsAnimated(true), 200);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadingFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!user?.resume) return;
    setDeleting(true);
    try {
      const { data } = await axios.delete(`${API}/resume`, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
      setUser(data.user);
      setAtsAnimated(false);
      toast.success('Resume removed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const resumeURL = user?.resume ? `${API}${user.resume}` : null;
  const resumeFileName = user?.resume?.split('/').pop() || 'resume.pdf';

  const tips = [
    {
      icon: <RiShieldCheckLine size={16} />,
      color: 'rgba(16,185,129,0.12)',
      iconColor: 'var(--success)',
      border: 'rgba(16,185,129,0.2)',
      title: 'ATS Optimized',
      body: 'Use standard headings like Experience, Education, Skills for better parsing.',
    },
    {
      icon: <RiBarChartLine size={16} />,
      color: 'var(--accent-dim)',
      iconColor: 'var(--accent)',
      border: 'var(--accent-border)',
      title: 'Quantify Impact',
      body: 'Add numbers — "Improved load time by 40%" scores higher than vague statements.',
    },
    {
      icon: <RiTimeLine size={16} />,
      color: 'rgba(245,158,11,0.1)',
      iconColor: 'var(--warning)',
      border: 'rgba(245,158,11,0.2)',
      title: 'Keep it Concise',
      body: '1–2 pages is ideal. Recruiters spend an average of 6 seconds on the first scan.',
    },
    {
      icon: <RiFileTextLine size={16} />,
      color: 'rgba(139,92,246,0.12)',
      iconColor: '#a78bfa',
      border: 'rgba(139,92,246,0.25)',
      title: 'PDF Format Only',
      body: 'Always export as PDF to preserve formatting across all devices and ATS systems.',
    },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="resume-root">

        {/* Header */}
        <div className="resume-header">
          <div className="resume-header-top">
            <div>
              <h1>Resume Manager</h1>
              <p>Upload your resume · Get ATS score · Track readiness</p>
            </div>
          </div>
        </div>

        {/* Replace warning */}
        {user?.resume && !uploading && (
          <div className="replace-banner">
            <div className="replace-banner-left">
              <RiErrorWarningLine size={15} />
              <span>Uploading a new resume will replace your current one</span>
            </div>
          </div>
        )}

        {/* Upload progress */}
        {uploading && uploadingFile && (
          <div className="upload-progress-card">
            <div className="progress-file-row">
              <div className="progress-file-icon">
                <RiFilePdf2Line size={22} />
              </div>
              <div className="progress-file-info">
                <div className="progress-file-name">{uploadingFile.name}</div>
                <div className="progress-file-size">{formatBytes(uploadingFile.size)}</div>
              </div>
              <div className="progress-pct">{uploadProgress}%</div>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}>
                <div className="progress-bar-shimmer" />
              </div>
            </div>
            <div className="progress-status">
              <div className="progress-status-dot" />
              {uploadProgress < 100 ? 'Uploading to secure server…' : 'Processing your resume…'}
            </div>
          </div>
        )}

        {/* Drop zone — always visible */}
        {!uploading && (
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-zone-grid" />
            <div className="dz-icon-wrap">
              <div className="dz-icon-bg">
                <RiUploadCloud2Line size={32} />
              </div>
              <div className="dz-pulse" />
            </div>
            <div className="dz-title">
              {dragging ? 'Release to upload' : 'Drag & drop your resume here'}
            </div>
            <div className="dz-sub">
              or <span onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>browse from your device</span>
            </div>
            <div className="dz-chips">
              <div className="dz-chip"><div className="dz-chip-dot" /> PDF only</div>
              <div className="dz-chip"><div className="dz-chip-dot" style={{ background: 'var(--accent)' }} /> Max 5MB</div>
              <div className="dz-chip"><div className="dz-chip-dot" style={{ background: 'var(--accent-3)' }} /> ATS analysis included</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files[0]) processFile(e.target.files[0]); }}
            />
          </div>
        )}

        {/* Existing resume card */}
        {user?.resume && !uploading && (
          <div className="resume-card">
            <div className="resume-card-header">
              <div className="resume-file-icon">
                <RiFilePdf2Line size={26} />
                <div className="resume-file-badge"><RiCheckboxCircleLine /></div>
              </div>
              <div className="resume-info">
                <div className="resume-name">{resumeFileName}</div>
                <div className="resume-meta">
                  <div className="resume-meta-item">
                    <RiTimeLine size={12} />
                    Uploaded {formatDate(user?.resumeUploadedAt)}
                  </div>
                  <div className="resume-meta-item" style={{ color: 'var(--success)', fontWeight: 600 }}>
                    <RiCheckboxCircleLine size={12} />
                    Active
                  </div>
                </div>
              </div>
              <div className="resume-actions">
                <a
                  href={resumeURL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                  title="Preview"
                  onClick={e => e.stopPropagation()}
                >
                  <RiEyeLine size={15} />
                  <span style={{ display: 'none' }}>View</span>
                </a>
                <a
                  href={resumeURL}
                  download={resumeFileName}
                  className="btn-ghost"
                  title="Download"
                  onClick={e => e.stopPropagation()}
                >
                  <RiDownloadLine size={15} />
                </a>
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                  title="Delete"
                >
                  {deleting ? <div className="btn-spinner-dark" /> : <RiDeleteBinLine size={15} />}
                </button>
              </div>
            </div>

            {/* ATS Score */}
            <div className="ats-section">
              <div className="ats-header">
                <div className="ats-title">
                  <RiShieldCheckLine size={15} style={{ color: 'var(--success)' }} />
                  ATS Compatibility Score
                </div>
                <div className={`ats-score-badge ${getATSClass(atsScore)}`}>
                  {atsScore}%
                  <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.8 }}>
                    · {getATSLabel(atsScore)}
                  </span>
                </div>
              </div>

              {/* Metric chips */}
              <div className="ats-metrics">
                {atsMetrics.map(m => (
                  <div className="ats-metric" key={m.label}>
                    <div className="ats-metric-label">{m.label}</div>
                    <div className="ats-metric-val">{m.value}</div>
                    <div className="ats-metric-sub">{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Breakdown bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {atsBars.map(bar => (
                  <div className="ats-bar-wrap" key={bar.label}>
                    <div className="ats-bar-label">
                      <span>{bar.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{bar.score}%</span>
                    </div>
                    <div className="ats-bar-track">
                      <div
                        className="ats-bar-fill"
                        style={{
                          width: atsAnimated ? `${bar.score}%` : '0%',
                          background: atsBarColor(bar.score),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips grid */}
        <div className="tips-grid">
          {tips.map(tip => (
            <div className="tip-card" key={tip.title}>
              <div className="tip-icon" style={{
                background: tip.color,
                border: `1px solid ${tip.border}`,
                color: tip.iconColor
              }}>
                {tip.icon}
              </div>
              <div>
                <div className="tip-title">{tip.title}</div>
                <div className="tip-body">{tip.body}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default ResumeUpload;