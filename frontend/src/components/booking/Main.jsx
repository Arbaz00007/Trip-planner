import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Main = () => {
    return (
        <div className="flex p-4">
            <div className="h-[calc(100vh-6rem)] w-[18%]">
                <Sidebar />
            </div>
            <div className="w-[82%] p-2 flex flex-col bg-[#F1F5F9]">
                <Outlet />
            </div>
        </div>
    );
};

export default Main;
