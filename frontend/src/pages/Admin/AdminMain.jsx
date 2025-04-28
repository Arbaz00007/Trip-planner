import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Topbar from "./Topbar";

const AdminMain = () => {
  return (
    <div className="flex">
      <div className="h-[100vh] w-[18%] fixed left-0 top-0 z-20">
        <AdminSidebar />
      </div>
      <div className="w-[82%] ml-[18%] flex flex-col bg-[#F1F5F9]">
        <Topbar />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
