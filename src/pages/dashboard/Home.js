import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  RiFileTextLine, RiRobotLine, RiBarChartLine, RiTrophyLine
} from 'react-icons/ri';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Interviews Done', value: '0', icon: RiFileTextLine, color: 'bg-indigo-500/10 text-indigo-400' },
  { label: 'AI Sessions', value: '0', icon: RiRobotLine, color: 'bg-purple-500/10 text-purple-400' },
  { label: 'Avg Score', value: '0%', icon: RiBarChartLine, color: 'bg-green-500/10 text-green-400' },
  { label: 'Best Score', value: '0%', icon: RiTrophyLine, color: 'bg-yellow-500/10 text-yellow-400' },
];

const quickActions = [
  { label: 'Start MCQ Test', desc: 'Practice with questions', path: '/dashboard/mcq', color: 'border-indigo-500/30 hover:border-indigo-500', icon: '📝' },
  { label: 'AI Mock Interview', desc: 'Practice with Gemini AI', path: '/dashboard/ai-interview', color: 'border-purple-500/30 hover:border-purple-500', icon: '🤖' },
  { label: 'Upload Resume', desc: 'Get ATS score', path: '/dashboard/resume', color: 'border-green-500/30 hover:border-green-500', icon: '📄' },
  { label: 'View Analytics', desc: 'Track your progress', path: '/dashboard/analytics', color: 'border-yellow-500/30 hover:border-yellow-500', icon: '📊' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 mt-1">Ready to ace your next interview? Let's get started.</p>
        {!user?.isEmailVerified && (
          <div className="mt-3 flex items-center gap-2 text-yellow-400 text-sm bg-yellow-400/10 px-3 py-2 rounded-lg w-fit">
            ⚠️ Please verify your email address
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-gray-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ label, desc, path, color, icon }) => (
            <Link
              key={path}
              to={path}
              className={`bg-gray-900 border ${color} rounded-xl p-4 transition-all duration-200 hover:bg-gray-800 group`}
            >
              <span className="text-3xl">{icon}</span>
              <p className="text-white font-medium mt-3">{label}</p>
              <p className="text-gray-400 text-sm mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-gray-400">No activity yet. Start your first interview!</p>
          <Link
            to="/dashboard/mcq"
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
          >
            Start Now
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;