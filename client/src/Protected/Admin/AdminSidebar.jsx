import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, ShieldCheck, Flag, BookOpen, 
  LayoutDashboard, LogOut, ChevronRight, X 
} from "lucide-react";

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen, onLogout }) => {
  const location = useLocation();

    const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout();
    navigate("/");
  };

  const menuItems = [
    { 
      name: "Users", 
      icon: <Users size={20}/>,
      submenu: [
        { name: "Guides", path: "/guides" },
        { name: "Trekkers", path: "/trekkers" }
      ]
    },
    { 
      name: "Reports", 
      icon: <Flag size={20}/>,
      submenu: [
        { name: "User Reports", path: "/usersReports" },
        { name: "Blog Reports", path: "/blogsReports" }
      ]
    },
    { name: "Blogs", path: "/blogs", icon: <BookOpen size={20}/> },
    { name: "Verifications", path: "/verifications", icon: <ShieldCheck size={20}/> },
  ];

  return (
    <div className="flex flex-col h-full p-6 text-white bg-zinc-950 border-r border-white/5">
      {/* Sidebar Header with Logo and Close Button for Mobile */}
      <div className="flex items-center justify-between mb-10 px-2">
        <Link to="/" onClick={() => setIsMobileOpen(false)}>
          <img src="/src/assets/logoHW.png" alt="Logo" className="h-12 lg:h-14" />
        </Link>
        <button 
          onClick={() => setIsMobileOpen(false)} 
          className="lg:hidden p-2 text-zinc-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.name} className="mb-4">
            {item.submenu ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                   <span className="opacity-50">{item.icon}</span> {item.name}
                </div>
                {item.submenu.map(sub => (
                  <Link 
                    to={sub.path} 
                    key={sub.name}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all mb-1 ${
                      location.pathname === sub.path ? "bg-[#E2E675]/10 text-[#E2E675] font-bold" : "text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    {sub.name} <ChevronRight size={14} className="opacity-30" />
                  </Link>
                ))}
              </>
            ) : (
              <Link 
                to={item.path} 
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  location.pathname === item.path ? "bg-[#E2E675] text-black font-bold" : "text-zinc-400 hover:bg-white/5"
                }`}
              >
                {item.icon} <span className="font-medium">{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <button 
        onClick={handleLogout} 
        className="flex items-center gap-3 px-4 py-4 text-zinc-500 hover:text-red-400 transition-colors mt-auto border-t border-white/5"
      >
        <LogOut size={20}/> <span className="text-sm font-bold">Sign Out</span>
      </button>
    </div>
  );
};

export default AdminSidebar;