import React, { useContext, useEffect, useState } from 'react'
import BookCard from './BookCard'
import { AuthContext } from '../../context/authContext';
import { get } from '../../utils/api';

const Booking = () => {
    const { currentUser } = useContext(AuthContext)
    // console.log(currentUser.id);

    const [data, setData] = useState([])

    useEffect(() => {
        const res = get(`/api/getBookingByUser/${parseInt(currentUser?.id)}?status=Pending`)
        res.then(data => {
            console.log(data);

            setData(data)
        })
    }, [])
    return (
        <div>
            <h1 className='text-5xl font-bold'>Currently Booking Package</h1>
            <div className="grid grid-cols-2 gap-x-4 mt-4">
                {
                    data?.length > 0 ?
                        data.map((item, index) => (
                            <BookCard key={index} data={item} type="booking" />
                        )) :
                        <h1 className='text-6xl text-red-500 font-bold col-span-2 text-center'>No Booking Package Found</h1>
                }
            </div>
        </div>
    )
}

export default Booking