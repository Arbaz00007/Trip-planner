import React, { useContext } from 'react'
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { AuthContext } from '../../context/authContext';

const Topbar = () => {
    const { currentUser } = useContext(AuthContext);
    return (
        <header className='sticky top-0 z-999 flex w-full bg-white drop-shadow-1 h-20 shadow-md justify-end' >
            <div className="flex justify-center items-center gap-4 mr-8">
                <div className="rounded-full bg-[#EFF4FB] grid place-items-center h-8 w-8 cursor-pointer">
                    <IoMdNotificationsOutline />
                </div>
                <div className="rounded-full bg-[#EFF4FB] grid place-items-center h-8 w-8 cursor-pointer">
                    <AiOutlineMessage />
                </div>
                <div className="flex justify-center items-center gap-1">
                    <span className='text-primary font-bold'>{currentUser?.name}</span>
                    <div className="rounded-full bg-[#EFF4FB] grid place-items-center h-16 w-16 cursor-pointer text-[2rem]">
                        <FaUser />
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Topbar