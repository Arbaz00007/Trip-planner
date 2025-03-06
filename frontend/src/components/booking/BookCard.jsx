import React, { useEffect, useState } from 'react'
import { get } from '../../utils/api'
import { IoLocationOutline } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom';

const BookCard = ({ data }) => {
    const navigate = useNavigate()
    console.log(data);
    const [img, setImg] = useState([]);
    console.log(img);

    function splitImagePaths(imageString) {
        return imageString ? imageString.split(',') : [];
    }

    useEffect(() => {
        const images = splitImagePaths(data?.images);
        setImg(images)
    }, [])

    return (
        <div className='flex w-[38rem] h-[10rem] border-2 border-black '>
            <div className="h-full w-[40%] ">
                <img className='w-full h-full' src={`http://localhost:5050${img[0]}`} alt="" />
            </div>
            <div className="flex w-[60%] h-full">
                <div className="h-full w-[50%] p-2 border-r-2 flex flex-col">

                    <h1 className='font-extrabold text-2xl text-primary'>{data.pname}</h1>
                    <div className="flex gap-2 justify-start items-center">
                        <IoLocationOutline className='text-xl' /> <span className='text-gray-500'>{data.location}</span>
                    </div>
                    <div className="text-justify">
                        {
                            data.description.slice(0, 70) + '...'

                        }
                    </div>

                </div>
                <div className="h-full w-[50%] p-2 border-l-2 flex flex-col">
                    <h1 className='font-extrabold text-2xl text-primary'>Price</h1>
                    <span className='text-xl font-bold'>RS. {data.price}</span>
                    <div className="flex gap-2">
                        {
                            data.type === 'booked' &&
                            <button className='p-2 px-4 bg-red-500 rounded-md hover:bg-red-400 transition-all font-bold text-white'>Cancle</button>
                        }
                        {/* <Link to={`packages/our-package/${data.pid}`}> */}
                        <button className='p-2 px-4 bg-primary rounded-md hover:bg-lightPrimary transition-all font-bold text-white' onClick={() => navigate(`/packages/our-package/${data.pid}`)}>view</button>
                        {/* </Link> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookCard