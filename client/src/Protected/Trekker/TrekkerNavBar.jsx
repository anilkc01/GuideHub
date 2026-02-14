import React from 'react';
import { Link } from 'react-router-dom';

const TrekkerNavBar = ({ user, onLogout }) => {
  return (
    <nav 
      className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-2 lg:px-10 lg:py-3 
      bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl 
      transition-all duration-300 ease-in-out"
    >
      {/* Left Section: Just the Logo */}
      <div className="flex items-center">
        <Link to="/dashboard">
          <img 
            src="/src/assets/logoHW.png" 
            alt="GuideHub Logo" 
            className="h-12 w-auto lg:h-14"
          />
        </Link>
      </div>

      {/* Right Section: Links + User Profile */}
      <div className="flex items-center gap-6 lg:gap-10">
        
        {/* Navigation Links moved to the Right */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-white/70 hover:text-white transition-colors text-xl font-bold">
            About Us
          </Link>
          <Link 
            to="/community" 
            className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full text-xl font-bold transition-all"
          >
            Community
          </Link>
        </div>

        {/* Vertical Divider (Optional, for visual clarity) */}
        <div className="hidden md:block h-6 w-px bg-white/10"></div>

        {/* User Profile Area */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none">
              {user?.fullName || "Tek Bahadur KC"}
            </p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1 tracking-wider">
              Trekker
            </p>
          </div>
          
          <div className="group relative">
            <img 
              src={user?.avatar || "https://via.placeholder.com/40"} 
              alt="User Avatar" 
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-full object-cover border border-white/20 cursor-pointer hover:border-white/50 transition-all"
            />
            
            {/* Logout Dropdown */}
            <div className="absolute right-0 top-14 hidden group-hover:block bg-zinc-900 border border-white/10 p-2 rounded-xl shadow-2xl min-w-30">
               <button 
                 onClick={onLogout}
                 className="w-full text-left text-xs text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TrekkerNavBar;