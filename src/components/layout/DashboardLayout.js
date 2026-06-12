import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  BriefcaseIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, badge: null },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon, badge: null },
  { name: 'MCQ Tests', href: '/dashboard/tests', icon: DocumentTextIcon, badge: '3' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, badge: null },
  { name: 'AI Interview', href: '/dashboard/ai-interview', icon: ComputerDesktopIcon, badge: 'New' },
  { name: 'Jobs', href: '/dashboard/jobs', icon: BriefcaseIcon, badge: '12' },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-primary: #0A0E1A;
    --bg-secondary: #0F1629;
    --bg-card: #111827;
    --bg-hover: #1a2235;
    --accent: #3B82F6;
    --accent-glow: rgba(59, 130, 246, 0.15);
    --accent-2: #06B6D4;
    --accent-3: #8B5CF6;
    --text-primary: #F1F5F9;
    --text-secondary: #94A3B8;
    --text-muted: #475569;
    --border: rgba(148, 163, 184, 0.08);
    --border-hover: rgba(59, 130, 246, 0.3);
    --sidebar-w: 260px;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { font-family: var(--font-body); background: var(--bg-primary); }

  .dash-root {
    min-height: 100vh;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* ── Sidebar ── */
  .sidebar {
    position: fixed;
    top: 0; left: 0;
    width: var(--sidebar-w);
    height: 100vh;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 40;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0.6;
  }

  .sidebar-hidden { transform: translateX(-100%); }
  .sidebar-visible { transform: translateX(0); }

  @media (min-width: 1024px) {
    .sidebar { transform: translateX(0) !important; }
  }

  /* Logo area */
  .sidebar-logo {
    padding: 28px 24px 24px;
    border-bottom: 1px solid var(--border);
    position: relative;
  }

  .logo-mark {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--accent), var(--accent-3));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }

  .logo-icon svg { width: 18px; height: 18px; color: white; }

  .logo-text {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 800;
    background: linear-gradient(135deg, #fff 40%, var(--accent-2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }

  .logo-sub {
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 2px;
    font-weight: 500;
  }

  /* Nav */
  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    overflow-y: auto;
  }

  .nav-section-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 600;
    padding: 8px 12px 6px;
    margin-bottom: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    color: var(--text-secondary);
    text-decoration: none;
    margin-bottom: 2px;
    position: relative;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .nav-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--border);
  }

  .nav-item.active {
    background: var(--accent-glow);
    color: var(--accent);
    border-color: var(--border-hover);
  }

  .nav-item.active .nav-icon { color: var(--accent); }

  .nav-item.active::before {
    content: '';
    position: absolute;
    left: -12px; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 24px;
    background: var(--accent);
    border-radius: 0 3px 3px 0;
  }

  .nav-icon { width: 18px; height: 18px; flex-shrink: 0; }
  .nav-label { flex: 1; }

  .nav-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 20px;
    letter-spacing: 0.3px;
  }

  .nav-badge.number {
    background: rgba(59,130,246,0.15);
    color: var(--accent);
    border: 1px solid rgba(59,130,246,0.2);
  }

  .nav-badge.new-badge {
    background: linear-gradient(135deg, #8B5CF6, #3B82F6);
    color: white;
  }

  /* AI Promo Card */
  .ai-promo {
    margin: 0 12px 16px;
    padding: 16px;
    background: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1));
    border: 1px solid rgba(139,92,246,0.25);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .ai-promo::before {
    content: '';
    position: absolute;
    top: -20px; right: -20px;
    width: 80px; height: 80px;
    background: radial-gradient(circle, rgba(139,92,246,0.2), transparent);
    border-radius: 50%;
  }

  .ai-promo-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .ai-promo-sub {
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.4;
    margin-bottom: 10px;
  }

  .ai-promo-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--accent-2);
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  /* Sidebar footer */
  .sidebar-footer {
    padding: 12px;
    border-top: 1px solid var(--border);
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: var(--bg-hover);
    border: 1px solid var(--border);
    margin-bottom: 8px;
  }

  .avatar {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-3));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
  }

  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 11px; color: var(--text-muted); }

  .status-dot {
    width: 8px; height: 8px;
    background: #10B981;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(16,185,129,0.5);
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    color: #F87171;
    background: none;
    border: 1px solid transparent;
    width: 100%;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    font-family: var(--font-body);
    transition: all 0.2s;
  }

  .logout-btn:hover {
    background: rgba(248,113,113,0.08);
    border-color: rgba(248,113,113,0.15);
  }

  .logout-btn svg { width: 16px; height: 16px; }

  /* ── Main ── */
  .main-wrap {
    padding-left: 0;
    transition: padding-left 0.3s;
  }

  @media (min-width: 1024px) {
    .main-wrap { padding-left: var(--sidebar-w); }
  }

  /* Topbar */
  .topbar {
    position: sticky; top: 0; z-index: 30;
    background: rgba(10, 14, 26, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .topbar-left { display: flex; align-items: center; gap: 16px; }

  .hamburger {
    background: none; border: none;
    color: var(--text-secondary);
    cursor: pointer; padding: 6px;
    border-radius: 8px;
    transition: all 0.2s;
    display: flex;
  }
  .hamburger:hover { background: var(--bg-hover); color: var(--text-primary); }
  .hamburger svg { width: 22px; height: 22px; }

  @media (min-width: 1024px) { .hamburger { display: none !important; } }

  .breadcrumb {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; color: var(--text-muted);
    display: none;
  }
  @media (min-width: 640px) { .breadcrumb { display: flex; } }

  .breadcrumb-active { color: var(--text-primary); font-weight: 500; }

  .topbar-right { display: flex; align-items: center; gap: 8px; }

  .search-box {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 13px;
    color: var(--text-muted);
    cursor: text;
    transition: all 0.2s;
    display: none;
  }
  @media (min-width: 768px) { .search-box { display: flex; } }
  .search-box:hover { border-color: var(--border-hover); color: var(--text-secondary); }
  .search-box svg { width: 15px; height: 15px; }

  .icon-btn {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-secondary);
    padding: 8px;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .icon-btn:hover { border-color: var(--border-hover); color: var(--text-primary); background: var(--bg-hover); }
  .icon-btn svg { width: 18px; height: 18px; }

  .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px;
    background: var(--accent);
    border-radius: 50%;
    border: 1.5px solid var(--bg-primary);
  }

  .topbar-avatar {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent-3));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: 14px; font-weight: 700; color: white;
    cursor: pointer;
    border: 1px solid rgba(59,130,246,0.3);
    transition: all 0.2s;
  }
  .topbar-avatar:hover { box-shadow: 0 0 16px rgba(59,130,246,0.3); }

  /* Page content */
  .page-content {
    padding: 28px;
    min-height: calc(100vh - 64px);
  }

  /* Overlay */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(2px);
    z-index: 35;
    display: none;
  }
  .overlay.show { display: block; }
  @media (min-width: 1024px) { .overlay { display: none !important; } }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* Entrance animation */
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .page-content { animation: fadeSlideIn 0.35s ease; }
`;

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const activeNav = navigation.find(n => n.href === location.pathname) || navigation[0];

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">

        {/* Overlay */}
        <div
          className={`overlay ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-visible' : 'sidebar-hidden'}`}>
          {/* Logo */}
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">
                <SparklesIcon />
              </div>
              <div>
                <div className="logo-text">PrepAI</div>
                <div className="logo-sub">Interview Platform</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main Menu</div>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${location.pathname === item.href ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="nav-icon" />
                <span className="nav-label">{item.name}</span>
                {item.badge && (
                  <span className={`nav-badge ${item.badge === 'New' ? 'new-badge' : 'number'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* AI Promo */}
          <div className="ai-promo">
            <div className="ai-promo-title">✦ Practice with AI</div>
            <div className="ai-promo-sub">Get real-time feedback on your interview answers.</div>
            <button className="ai-promo-btn">
              Start Session <ChevronRightIcon style={{ width: 13, height: 13 }} />
            </button>
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="avatar">A</div>
              <div className="user-info">
                <div className="user-name">Anuj Singh</div>
                <div className="user-role">Pro Member</div>
              </div>
              <div className="status-dot" />
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <ArrowRightOnRectangleIcon />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="main-wrap">
          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-left">
              <button className="hamburger" onClick={() => setSidebarOpen(true)}>
                <Bars3Icon />
              </button>
              <div className="breadcrumb">
                <span>PrepAI</span>
                <ChevronRightIcon style={{ width: 13, height: 13 }} />
                <span className="breadcrumb-active">{activeNav.name}</span>
              </div>
            </div>

            <div className="topbar-right">
              <div className="search-box">
                <MagnifyingGlassIcon />
                <span>Quick search…</span>
              </div>
              <button className="icon-btn">
                <BellIcon />
                <span className="notif-dot" />
              </button>
              <div className="topbar-avatar">A</div>
            </div>
          </header>

          {/* Content */}
          <main className="page-content">
            <Outlet />
          </main>
        </div>

      </div>
    </>
  );
}

export default DashboardLayout;