import React, { useContext, useEffect, useState } from 'react'
import BookCard from './BookCard'
import { AuthContext } from '../../context/authContext';
import { get } from '../../utils/api';

const Canceled = () => {
    const { currentUser } = useContext(AuthContext)
    // console.log(currentUser.id);

    const [data, setData] = useState([])

    useEffect(() => {
        const res = get(`/api/getBookingByUser/${parseInt(currentUser?.id)}?status=Cancelled`)
        res.then(data => {
            console.log(data);

            setData(data)
        })
    }, [])
    return (
        <div>
            <h1 className='text-5xl font-bold'>Cancelled Package</h1>
            <div className="grid grid-cols-2 gap-x-4 mt-4">
                {
                    data.length > 0 ?
                        data.map((item, index) => (
                            <BookCard key={index} data={item} type='cancel' />
                        )) :
                        <h1 className='text-6xl text-red-500 font-bold col-span-2 text-center'>No Cancelled Package Found</h1>
                }
            </div>
        </div>
    )
}

export default Canceled