import { useEffect, useState } from "react";
import AdminDashboard from "./Protected/Admin/AdminDashboard";
import GuideDashboard from "./Protected/Guides/GuideDashboard";
import GuestLayout from "./Unprotected/GuestLayout";
import toast from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import api from "./api/axios";
import TrekkerDashboard from "./Protected/Trekker/TrekkerDashboard";
import MyPlanDetails from "./Protected/Trekker/Pages/PlanPage";
import ExplorePlanDetails from "./Protected/Guides/Pages/PlanDetail";
import MyTreksPage from "./Protected/Guides/Pages/myTreks";
import ExploreSection from "./Protected/Guides/Pages/Explore";

// Blog Components
import BlogsPage from "./Protected/Common/Blogs";
import BlogDetail from "./Protected/Common/BlogDetail"; // You'll create this
import WriteBlog from "./Protected/Common/WriteBlog";   // You'll create this

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      setRole(null);
      setAuthChecked(true);
      return;
    }

    try {
      const res = await api.get("/auth/verify-token");
      setAuthorized(true);
      setRole(res.data.user.role);
    } catch (err) {
      toast.error("Session expired. Please log in again.", { id: "auth-error" });
      localStorage.clear();
      sessionStorage.clear();
      setAuthorized(false);
      setRole(null);
    } finally {
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!authChecked) return null;

  return (
    <Routes>
      {/* GUEST */}
      {!authorized && (
        <Route path="*" element={<GuestLayout onLoginSuccess={checkAuth} />} />
      )}

      {/* ADMIN */}
      {authorized && role === "admin" && (
        <Route path="/" element={<AdminDashboard onLogout={checkAuth} />} />
      )}

      {/* TREKKER */}
      {authorized && role === "trekker" && (
        <>
          <Route path="/" element={<TrekkerDashboard onLogout={checkAuth} />} />
          
          {/* Blog Routes for Trekker */}
          <Route path="/blogs" element={<BlogsPage userRole="trekker" onLogout={checkAuth} />} />
          <Route path="/blogs/:id" element={<BlogDetail userRole="trekker" onLogout={checkAuth} />} />
          <Route path="/blogs/write" element={<WriteBlog userRole="trekker" onLogout={checkAuth} />} />

          <Route path="/myPlan/:id" element={<MyPlanDetails onLogout={checkAuth} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

      {/* GUIDE */}
      {authorized && role === "guide" && (
        <>
          <Route path="/" element={<GuideDashboard onLogout={checkAuth} />}>
            <Route index element={<ExploreSection />} />
            <Route path="myTrips" element={<MyTreksPage />} />
          </Route>

          {/* Blog Routes for Guide (Full Screen) */}
          <Route path="/blogs" element={<BlogsPage userRole="guide" onLogout={checkAuth} />} />
          <Route path="/blogs/:id" element={<BlogDetail userRole="guide" onLogout={checkAuth} />} />
          <Route path="/blogs/write" element={<WriteBlog userRole="guide" onLogout={checkAuth} />} />

          <Route path="/explore/:id" element={<ExplorePlanDetails onLogout={checkAuth} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

export default App;