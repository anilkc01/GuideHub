import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";

const TrekkerNavBar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutAction = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout();
    navigate("/");
  };

  const isOnBlogPage = location.pathname.startsWith("/blogs");

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-2 lg:px-10 lg:py-3 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="flex items-center">
        <Link to="/">
          <img
            src="/src/assets/logoHW.png"
            alt="Logo"
            className="h-12 lg:h-14"
          />
        </Link>
      </div>

      <div className="flex items-center gap-6 lg:gap-10">
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/about"
            className="text-white/70 hover:text-white transition-colors text-xl font-bold"
          >
            About Us
          </Link>

          {isOnBlogPage ? (
            <Link
              to="/"
              className="text-emerald-400 hover:text-white transition-colors text-xl font-bold flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Dashboard
            </Link>
          ) : (
            <Link
              to="/blogs"
              className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-xl font-bold transition-all"
            >
              Blogs
            </Link>
          )}
        </div>

        <div className="hidden md:block h-6 w-px bg-white/10"></div>

        {/* PROFILE SECTION WITH ON-CLICK DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none group-hover:text-emerald-400 transition-colors">
                {user?.fullName || "Guest User"}
              </p>
              <p className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-widest">
                Trekker
              </p>
            </div>
            <div className="relative">
              <div
                className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all ${
                  showDropdown
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-white/10 group-hover:border-white/30 bg-white/5"
                }`}
              >
                {user?.dp ? (
                  <img
                    src={`http://localhost:5002/${user.dp}`}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <User className="w-6 h-6 text-zinc-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-zinc-900 border border-white/10 rounded-full p-0.5">
                <ChevronDown
                  size={10}
                  className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* DROPDOWN MENU */}
          {showDropdown && (
            <div className="absolute right-0 mt-4 w-48 bg-zinc-950 border border-white/10 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 w-full text-left text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all"
              >
                <User size={14} /> View Profile
              </Link>

              <div className="h-px bg-white/5 my-1 mx-2" />

              <button
                onClick={handleLogoutAction}
                className="flex items-center gap-3 w-full text-left text-[11px] font-bold text-red-400 hover:bg-red-500/10 p-3 rounded-xl transition-all"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TrekkerNavBar;
