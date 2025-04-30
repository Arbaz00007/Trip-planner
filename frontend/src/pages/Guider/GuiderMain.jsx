import { Outlet } from "react-router-dom";
import GuiderSidebar from "./GuiderSidebar";
import Topbar from "./Topbar";

const GuiderMain = () => {
  return (
    <div className="flex">
      <div className="h-[100vh] w-[18%] fixed">
        <GuiderSidebar />
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

export default GuiderMain;
