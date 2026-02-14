import { Navigate, useNavigate } from "react-router-dom";

const AdminDashboard = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutAction = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout();             
    navigate("/");          
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogoutAction}>Logout</button>
    </div>
  );
};

export default AdminDashboard;