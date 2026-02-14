import {  useNavigate } from "react-router-dom";

const GuideDashboard = ({ onLogout }) => {

    const navigate = useNavigate();

    const handleLogoutAction = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout();             
    navigate("/");    
    };


  return (
    <div className="dashboard">
      <h2>Guide Dashboard</h2>
      <button onClick={handleLogoutAction}>Logout</button>
    </div>
  );
};

export default GuideDashboard;