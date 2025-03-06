import React, { useEffect, useState } from 'react'
import Upper from './Upper'
import Card from '../global/Card'
import { get } from '../../utils/api';

const Main = () => {
    const [data, setData] = useState([]);
    // console.log(data);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const res = await get('/api/getPosts');
        console.log(res);
        setData(res);

    }

    return (
        <div className='flex flex-col items-center'>
            <Upper />
            <div className="flex flex-col mt-10 w-full">
                <h1 className='text-6xl font-bold w-full text-start'>Our Packages</h1>
                {
                    data.length > 0 ? (
                        <div id='explore' className="gap-16 place-items-center grid grid-cols-3 px-20 p-4">
                            {
                                data?.map((item) => {
                                    return (
                                        <Card
                                            location={item.location}
                                            pname={item.pname}
                                            price={item.price}
                                            description={item.description}
                                            image={item.images?.split(',')[0]}
                                            key={item.pid}
                                            pid={item.pid}
                                        />
                                    )
                                })
                            }
                        </div>
                    ) : (
                        <h1 className='text-6xl p-8 font-bold text-red-500 text-center w-full'>No Package Found</h1>
                    )
                }

            </div>
        </div>
    )
}

export default Main