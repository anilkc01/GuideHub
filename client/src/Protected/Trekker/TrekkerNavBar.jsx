import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  Menu,
  X,
  Info,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { createPortal } from "react-dom";

const TrekkerNavBar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    setMobileMenuOpen(false);
  };

  const isOnBlogPage = location.pathname.startsWith("/blogs");

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 lg:px-10 lg:py-3 bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all duration-300">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" className="shrink-0">
          <img
            src="/src/assets/logoHW.png"
            alt="Logo"
            className="h-10 lg:h-14 w-auto object-contain"
          />
        </Link>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 lg:gap-10">
        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          

          {isOnBlogPage ? (
            <Link
              to="/"
              className="text-emerald-400 hover:text-white transition-colors text-lg lg:text-xl font-bold flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/blogs"
              className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full text-lg lg:text-xl font-bold transition-all"
            >
              Blogs
            </Link>
          )}
        </div>

        <div className="hidden md:block h-6 w-px bg-white/10" />

        {/* DESKTOP PROFILE */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white leading-none group-hover:text-emerald-400 transition-colors">
                {user?.fullName?.split(" ")[0] || "Guest"}
              </p>
              <p className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-widest">
                Trekker
              </p>
            </div>

            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all ${
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
                <User className="text-zinc-400" />
              )}
            </div>
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-4 w-48 bg-zinc-950 border border-white/10 p-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <Link
                to="/profile"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 w-full text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all"
              >
                <User size={14} /> View Profile
              </Link>

              <div className="h-px bg-white/5 my-1 mx-2" />

              <button
                onClick={handleLogoutAction}
                className="flex items-center gap-3 w-full text-[11px] font-bold text-red-400 hover:bg-red-500/10 p-3 rounded-xl transition-all"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen &&
  createPortal(
    <div className="fixed inset-0 z-9999 md:hidden">

      <div
        className="absolute inset-0 bg-black/90"
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className="absolute top-0 left-0 h-full w-80 bg-zinc-950 border-r border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">

        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <img src="/src/assets/logoHW.png" className="h-10" />
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={24} className="text-white/70" />
          </button>
        </div>

        <div className="flex flex-col gap-2 px-4 py-6">
          

          <Link
            to="/blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-4 p-4 rounded-xl text-white/70 hover:bg-white/5 transition"
          >
            <BookOpen size={20} />
            <span className="font-bold">Blogs</span>
          </Link>

          {isOnBlogPage && (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl text-emerald-400 hover:bg-white/5 transition"
            >
              <LayoutDashboard size={20} />
              <span className="font-bold">Dashboard</span>
            </Link>
          )}

          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-4 p-4 rounded-xl text-white/70 hover:bg-white/5 transition"
          >
            <User size={20} />
            <span className="font-bold">Profile</span>
          </Link>
        </div>

        <div className="mt-auto px-4 pb-6">
          <button
            onClick={handleLogoutAction}
            className="flex items-center gap-4 w-full p-4 text-red-400 bg-red-500/10 rounded-xl font-bold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}
    </nav>
  );
};

export default TrekkerNavBar;