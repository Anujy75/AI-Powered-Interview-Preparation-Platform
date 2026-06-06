import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  RiDashboardLine, RiUserLine, RiFileTextLine,
  RiQuestionLine, RiRobotLine, RiBriefcaseLine,
  RiBarChartLine, RiLogoutBoxLine, RiAwardLine
} from 'react-icons/ri';

const navItems = [
  { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { path: '/dashboard/profile', icon: RiUserLine, label: 'Profile' },
  { path: '/dashboard/resume', icon: RiFileTextLine, label: 'Resume' },
  { path: '/dashboard/mcq', icon: RiQuestionLine, label: 'MCQ Test' },
  { path: '/dashboard/ai-interview', icon: RiRobotLine, label: 'AI Interview' },
  { path: '/dashboard/jobs', icon: RiBriefcaseLine, label: 'Jobs' },
  { path: '/dashboard/analytics', icon: RiBarChartLine, label: 'Analytics' },
  { path: '/dashboard/leaderboard', icon: RiAwardLine, label: 'Leaderboard' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col
        bg-gray-900 border-r border-gray-800
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-0 lg:w-64'}
        overflow-hidden
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            AI
          </div>
          <span className="text-white font-bold text-lg whitespace-nowrap">Interview Pro</span>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user?.avatar
              ? <img src={`${process.env.REACT_APP_API_URL}${user.avatar}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
              : user?.name?.charAt(0).toUpperCase()
            }
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs truncate">{user?.role}</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/dashboard'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200 whitespace-nowrap
                ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <RiLogoutBoxLine size={18} />
            <span className="text-sm font-medium whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;