import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  Menu,
  X,
  Map,
  Info,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { createPortal } from "react-dom";

const GuideNavBar = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isOnTripsPage = location.pathname === "/myTrips";
  const isOnBlogPage = location.pathname.startsWith("/blogs");

  const handleLogoutAction = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    {
      show: !isOnBlogPage,
      to: isOnTripsPage ? "/" : "/myTrips",
      label: isOnTripsPage ? "Explore Plans" : "My Trips",
      icon: <Map size={18} />,
      special: isOnTripsPage,
    },
   
    {
      to: isOnBlogPage ? "/" : "/blogs",
      label: isOnBlogPage ? "Dashboard" : "Blogs",
      icon: isOnBlogPage ? (
        <LayoutDashboard size={18} />
      ) : (
        <BookOpen size={18} />
      ),
      button: !isOnBlogPage,
      special: isOnBlogPage,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-4 py-2 lg:px-10 lg:py-3 bg-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="shrink-0">
          <img
            src="/src/assets/logoHW.png"
            alt="Logo"
            className="h-10 lg:h-14 w-auto"
          />
        </Link>
      </div>

      <div className="flex items-center gap-6 lg:gap-10">
        <div className="hidden md:flex items-center gap-8">
          {navLinks
            .filter((l) => l.show !== false)
            .map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-lg lg:text-xl font-bold transition-all flex items-center gap-2 ${
                  l.button
                    ? "bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full"
                    : l.special
                    ? "text-emerald-400 hover:text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {l.special && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
                {l.label}
              </Link>
            ))}
        </div>

        <div className="hidden md:block h-6 w-px bg-white/10" />

        <div ref={dropdownRef} className="relative hidden md:block">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right">
              <p className="text-sm font-bold text-white leading-none group-hover:text-emerald-400 transition-colors">
                {user?.fullName?.split(" ")[0]}
              </p>
              <p className="text-[9px] text-zinc-500 font-black uppercase mt-1 tracking-widest">
                Guide
              </p>
            </div>

            <div
              className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all ${
                showDropdown
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-white/10 group-hover:border-white/30"
              }`}
            >
              {user?.dp ? (
                <img
                  src={`http://localhost:5002/${user.dp}`}
                  className="w-full h-full object-cover"
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
                <User size={14} />
                Profile
              </Link>

              <button
                onClick={handleLogoutAction}
                className="flex items-center gap-3 w-full text-[11px] font-bold text-red-400 hover:bg-red-500/10 p-3 rounded-xl transition-all"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

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
          {navLinks.filter(l => l.show !== false).map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 p-4 rounded-xl text-white/70 hover:bg-white/5 transition"
            >
              {l.icon}
              <span className="font-bold">{l.label}</span>
            </Link>
          ))}

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
            Sign Out
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

export default GuideNavBar;