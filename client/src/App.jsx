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
import BlogsPage from "./Protected/Common/Blogs";
import BlogDetail from "./Protected/Common/BlogDetail";
import WriteBlog from "./Protected/Common/WriteBlog";
import UsersList from "./Protected/Admin/UserList";
import AdminBlogPage from "./Protected/Admin/AdminBlogsPage";
import AdminBlogDetail from "./Protected/Admin/AdminBlogDetails";
import GuideVerification from "./Protected/Admin/Verification";
import Profile from "./Protected/Common/myProfile";


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
      const {  valid, user } = res.data;
      console.log("Token verification response:", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
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

  useEffect(() => { checkAuth(); }, []);

  if (!authChecked) return null;

  return (
    <Routes>
      {!authorized && <Route path="*" element={<GuestLayout onLoginSuccess={checkAuth} />} />}

      {authorized && role === "admin" && (
        <Route path="/" element={<AdminDashboard onLogout={checkAuth} />}>
          <Route index element={<Navigate to="/guides" replace />} />
          <Route path="/blogs" element={<AdminBlogPage userRole="admin" onLogout={checkAuth} />} />
          <Route path="/blogs/:id" element={<AdminBlogDetail userRole="admin" onLogout={checkAuth} />} />
          <Route path="verifications" element={<GuideVerification />} />
          <Route path="guides" element={<UsersList type="guide" />} />
          <Route path="trekkers" element={<UsersList type="trekker" />} />
         
        </Route>
      )}

      {authorized && role === "trekker" && (
        <>
          <Route path="/" element={<TrekkerDashboard onLogout={checkAuth} />} />
          <Route path="/blogs" element={<BlogsPage userRole="trekker" onLogout={checkAuth} />} />
          <Route path="/blogs/:id" element={<BlogDetail userRole="trekker" onLogout={checkAuth} />} />
          <Route path="/blogs/write" element={<WriteBlog userRole="trekker" onLogout={checkAuth} />} />
          <Route path="/myPlan/:id" element={<MyPlanDetails onLogout={checkAuth} />} />
          <Route path="/profile" element={<Profile onLogout={checkAuth} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}

      {authorized && role === "guide" && (
        <>
          <Route path="/" element={<GuideDashboard onLogout={checkAuth} />}>
            <Route index element={<ExploreSection />} />
            <Route path="myTrips" element={<MyTreksPage />} />
            <Route path="profile" element={<Profile onLogout={checkAuth} />} />
          </Route>
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