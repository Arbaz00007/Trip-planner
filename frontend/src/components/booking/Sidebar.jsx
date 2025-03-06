import React from 'react'
import { Link } from 'react-router-dom'
import { CiBookmarkCheck, CiBookmarkPlus, CiBookmarkRemove } from "react-icons/ci";

const Sidebar = () => {
    return (
        <div className='flex flex-col p-4 gap-2'>
            <input className='outline-none p-2 border-2 border-black rounded-lg' type="search" name="" id="" placeholder='Search....' />
            <ul>
                <Link className='hover:text-primary  flex gap-1 font-bold text-lg items-center' to='/booking'>
                    <CiBookmarkCheck />
                    <li>
                        Booking
                    </li>
                </Link>
                <Link className='hover:text-primary  flex gap-1 font-bold text-lg items-center' to='/booked'>
                    <CiBookmarkPlus />
                    <li>Booked</li>
                </Link>
                <Link className='hover:text-primary  flex gap-1 font-bold text-lg items-center' to='/canceled'>
                    <CiBookmarkRemove />
                    <li>Cancelled</li>

                </Link>
            </ul>

        </div>
    )
}

export default Sidebar