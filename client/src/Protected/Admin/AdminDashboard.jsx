import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();


  return (
    <div className="flex w-full min-h-screen bg-black overflow-hidden">
      {/* Left Sidebar (Fixed) */}
      <aside className="w-72 flex-shrink-0 h-screen sticky top-0 border-r border-white/5">
        <AdminSidebar onLogout={onLogout} />
      </aside>

      {/* Right Content Area (Scrollable) */}
      <main className="flex-1 h-screen overflow-y-auto bg-black p-10 lg:p-14">
        <div className="max-w-[1600px] mx-auto">
          <Outlet /> {/* This will render UsersPage when navigating to /guides or /trekkers */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;