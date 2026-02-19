import { useEffect, useState } from "react";
import AdminDashboard from "./Protected/Admin/AdminDashboard";
import GuideDashboard from "./Protected/Guides/GuideDashboard";
import GuestLayout from "./Unprotected/GuestLayout";
import toast from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import api from "./api/axios";
import TrekkerDashboard from "./Protected/Trekker/TrekkerDashboard";
import MyPlanDetails from "./Protected/Trekker/Pages/PlanPage";
import ExplorePlanDetails from "./Protected/Guides/Pages/PlanDetail";

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    console.log("Checking authentication...");
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setAuthorized(false);
      setRole(null);
      setAuthChecked(true);
      return;
    }

    try {
      const res = await api.get("/auth/verify-token");
      console.log("Auth check response:", res.data);
      setAuthorized(true);
      setRole(res.data.user.role);
    } catch (err) {
      toast.error("Session expired. Please log in again.", {
        id: "auth-error",
      });
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
        <Route
          path="/"
          element={<AdminDashboard onLogout={checkAuth} />}
        ></Route>
      )}

      {/* Trekker */}
      {authorized && role === "trekker" && (
        <>
          <Route path="/" element={<TrekkerDashboard onLogout={checkAuth} />} />
          <Route
            path="/myPlan/:id"
            element={<MyPlanDetails onLogout={checkAuth} />}
          />
        </>
      )}

      {/* Guide */}
      {authorized && role === "guide" && (
        <>
          <Route path="/" element={<GuideDashboard onLogout={checkAuth} />} />
          <Route
            path="/explore/:id"
            element={<ExplorePlanDetails onLogout={checkAuth} />}
          />
          
        </>
      )}
    </Routes>
  );
};

export default App;
