import { Navigate, Outlet } from "react-router-dom";

const IsAdmin = () => {
    const isAuthenticated = JSON.parse(localStorage.getItem("user")).role_id; // Example: Checking token in localStorage
    // console.log(isAuthenticated, " :isAuthenticated");

    return isAuthenticated === 1 ? <Outlet /> : <Navigate to="/401-Error-Unauthorized" />;
};

export default IsAdmin;
