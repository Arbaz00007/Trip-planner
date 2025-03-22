import { Navigate, Outlet } from "react-router-dom";

const IsGuider = () => {
  const isAuthenticated = JSON.parse(localStorage.getItem("user")).role_id; // Example: Checking token in localStorage
  console.log(isAuthenticated, " :isAuthenticated");

  return parseInt(isAuthenticated) === 2 ? (
    <Outlet />
  ) : (
    <Navigate to="/401-Error-Unauthorized" />
  );
};

export default IsGuider;
