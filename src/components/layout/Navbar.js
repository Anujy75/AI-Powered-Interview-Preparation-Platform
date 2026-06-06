import React from 'react';
import { RiMenuLine, RiBellLine, RiSearchLine } from 'react-icons/ri';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ setIsOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 lg:px-6">

      {/* Left — hamburger + search */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <RiMenuLine size={22} />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 w-64">
          <RiSearchLine size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
          />
        </div>
      </div>

      {/* Right — notifications + avatar */}
      <div className="flex items-center gap-3">
        <button className="relative text-gray-400 hover:text-white transition-colors p-2">
          <RiBellLine size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.avatar
              ? <img src={`http://localhost:5000${user.avatar}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
              : user?.name?.charAt(0).toUpperCase()
            }
          </div>
          <span className="hidden md:block text-sm text-white font-medium">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;