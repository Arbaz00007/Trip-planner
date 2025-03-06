import React from 'react'
import { IoLocationOutline, IoPricetag } from "react-icons/io5";
import { Link } from 'react-router-dom';
// import image from '../../image/img/feedbackBack.jpg'

const Card = ({ pname, location, price, description, image, pid }) => {
    // console.log(image);

    return (
        <div className='mt-8 w-[28rem]  shadow-2xl rounded-xl'>
            <div className="w-full h-[18rem]">
                <img src={`http://localhost:5050${image}`} alt="image" className='rounded-se-lg rounded-ss-lg w-full h-full object-cover' />
            </div>
            <div className="flex flex-col p-4 gap-2">

                <div className="flex flex-col">
                    <h1 className='font-extrabold text-2xl'>{pname}</h1>
                    <div className="flex gap-2 justify-start items-center">
                        <IoLocationOutline className='text-xl' /> <span className='text-gray-500'>{location}</span>
                    </div>
                </div>
                <div className="w-full h-[0.5px] bg-gray-400"></div>
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <IoPricetag /> <span className='font-bold text-primary text-xl'>PRICE</span>
                    </div>
                    <span className='text-xl font-bold'>RS. {price}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-400"></div>
                <div className="text-justify">
                    {
                        description?.slice(0, 170) + '...'

                    }
                </div>
                <div className="w-full h-[1px] bg-gray-400"></div>
                <div className="flex justify-end">
                    <Link to={`/packages/our-package/${pid}`}>
                        <button className='p-2 px-4 bg-primary rounded-md hover:bg-lightPrimary transition-all font-bold text-white'>more</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Card