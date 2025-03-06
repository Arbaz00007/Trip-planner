import React, { useState } from 'react'
import Mysvg from '../../image/svg/package.svg'
import GoDown from '../../image/img/goDown.gif'
import { FaSearch } from "react-icons/fa";
import { MdExplore } from "react-icons/md";


const Upper = () => {
    const [blur, setBlur] = useState(false)
    const handleChange = (e) => {
        if (e.target.value.length > 0) {
            setBlur(true)
        } else {
            setBlur(false)
        }
    }
    return (
        <div className='flex flex-col items-center justify-center w-full relative '>
            <div className="z-0 gap-16  h-[calc(100vh-8rem)]  w-full flex justify-center items-center">
                <img className=' mt-[-5rem] h-full' src={Mysvg} alt="" />
                <div className=" flex flex-col mt-25 gap-4">
                    <h1 className='text-6xl font-bold'>Advanture Waiting Ahead</h1>
                    <span className='text-2xl'>Unveiling Destinations, Creating Stories.</span>
                    <div className="flex items-center gap-[1rem]">
                        <a href="#explore">

                            <button className='flex justify-center items-center gap-1 p-2 px-4 bg-primary rounded-md hover:bg-lightPrimary transition-all font-bold text-white hover:text-black'>Explore <MdExplore className='text-2xl' /></button>
                        </a>
                        <div className="flex items-center flex-col h-[12rem] w-[18rem]">

                            <img src={GoDown} className='w-full h-full' alt="goDown" />
                            <span className='font-bold'>Scroll Down</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[-2rem] flex w-1/3 relative justify-center z-10">
                <input onChange={handleChange} className='rounded-md font-bold outline-none w-full p-2 pr-4  border-2 border-black' type="search" name="search" id="" placeholder='Search Your Desteny' />
                <div className="absolute top-2 right-2">
                    <FaSearch className='font-bold text-2xl' />
                </div>
            </div>
            {
                blur &&
                <div className="absolute top-0 h-[calc(100vh-5rem)] w-full backdrop-blur-sm bg-white/80 flex justify-center items-center">
                    <h1 className="text-6xl font-bold text-red-500">No Package Found</h1>
                </div>
            }

        </div>
    )
}

export default Upper