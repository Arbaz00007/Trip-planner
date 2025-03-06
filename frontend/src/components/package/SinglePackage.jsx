import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MdMessage } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import map from '../../image/img/map.png';
import axios from 'axios';

import { AuthContext } from '../../context/authContext';
import { get } from '../../utils/api';
import { toast } from 'react-toastify';

const SinglePackage = () => {
    const GetMap = () => {
        return (
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594818.8896156745!2d81.48912054987576!3d28.371988493731564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3995e8c77d2e68cf%3A0x34a29abcd0cc86de!2sNepal!5e0!3m2!1sen!2snp!4v1739361527580!5m2!1sen!2snp" className='h-full w-full' allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        )
    }
    let { pid } = useParams();
    const navigate = useNavigate();

    const { currentUser } = useContext(AuthContext);

    const [products, setProducts] = useState([]);
    const [imageArr, setImageArr] = useState([]);
    const [myMainImg, setMyMainImg] = useState(null);
    const [currType, setCurrType] = useState('');
    const [currPrice, setCurrPrice] = useState(0);  // Current product price
    const [selectedDate, setSelectedDate] = useState(null);

    // For maximum selectable date
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);

    const isDateDisabled = currentUser === null;

    const loadData = async () => {
        const response = await get(`/api/getSinglePost/${pid}`);
        // console.log(response);

        setProducts(response);



    }

    useEffect(() => {
        loadData();
    }, [pid]);

    useEffect(() => {
        if (products) {
            const images = splitImagePaths(products?.images);
            setImageArr(images);
            // console.log(images);

            setMyMainImg(images[0]);
            setCurrType(products?.type);
            setCurrPrice(products?.price);  // Set the current product price
        }
    }, [products]);

    function splitImagePaths(imageString) {
        return imageString ? imageString.split(',') : [];
    }

    console.log(products);


    return (
        <div className="singleProduct flex h-[100vh] p-4">
            <div className="flex flex-col justify-between w-[50%] h-full p-6 relative">
                <div className="absolute bottom-0">
                    <Link to="/packages">
                        <button className='bg-bgbtn my-flex p-1 px-2 flex items-center gap-1 rounded-md border-2 border-black font-bold text-base hover:bg-bgbtnHover transition-colors duration-200 ease-in-out'>
                            <IoMdArrowRoundBack /> Back
                        </button>
                    </Link>
                </div>

                <div className="h-[80%] w-full flex flex-col justify-center items-center">
                    <div className="h-[100%] w-[95%] flex justify-center items-center">
                        <div className="border-[2.4px] border-black rounded-lg w-full h-[90%]">
                            <img src={`http://localhost:5050${myMainImg}`} alt="" className='rounded-md h-full w-full' />
                        </div>
                    </div>
                    <div className="h-[20%] w-[70%] flex justify-between gap-8">
                        {
                            imageArr?.map((data, inx) => (
                                <div key={inx} className="border-[2.4px] border-black rounded-lg overflow-hidden h-full w-1/3 cursor-pointer" onClick={() => setMyMainImg(data)}>
                                    <img src={`http://localhost:5050${data}`} alt="" className='rounded-sm h-full w-full' />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="h-1 w-full bg-black"></div>
                <div className="flex mb-8 px-12 items-start border-2 justify-between font-heading text-lg">
                    <span><span className="text-primary font-bold">Post by:</span> {products?.name}</span>
                    <span><span className="text-primary font-bold">Phone:</span> {products?.phone}</span>
                    <span><span className="text-primary font-bold">Address:</span> {products?.address}</span>
                </div>
            </div>
            <div className="h-[100%] w-1 bg-black" />
            <div className="singlePro flex w-[50%] gap-4 p-6 flex-col items-center font-heading overflow-y-scroll">
                <h1 className='text-primary text-6xl font-bold'>{products?.pname}</h1>

                <div className="flex text-xl gap-1 font-bold justify-start items-center">
                    <FaLocationDot className='text-xl' /> <span className='text-gray-500 font-bold'>{products?.location}</span>
                </div>

                <p className='text-justify text-lg p-4'>{products.description}</p>
                <div className="flex gap-8">
                    <span className='text-3xl'><span className="text-primary font-bold">Price: </span>Rs. {parseInt(products?.price)}</span>
                    <span className='text-3xl'><span className="text-primary font-bold">Time: </span>{products?.time}</span>

                </div>
                <div className="flex justify-between w-full gap-4 font-bold">
                    <button className='border-2 border-primary p-2 px-4 rounded-full my-grid'><MdMessage className='text-2xl text-primary' /></button>
                    <div className="leftBtns ">
                        {
                            // isPackageBooked && !isThisUserBook ?
                            //     <span style={{ fontWeight: "bolder", textAlign: "center", color: "red" }}>This package has alreaady been booked. Sorry for the inconvenience</span>
                            //     :
                            <form action="" className='bookingDateForm flex gap-8 ' >
                                <div className="relative ">

                                    <ReactDatePicker
                                        className='datePicker border-2 border-black p-2 rounded-lg'
                                        selected={selectedDate}
                                        onChange={date => setSelectedDate(date)}
                                        dateFormat="yyyy-MM-dd"
                                        minDate={new Date()}
                                        maxDate={maxDate}
                                        placeholderText='Select Date'
                                        disabled={isDateDisabled}
                                        required
                                    />
                                    <div className="absolute  h-full top-0 my-grid right-2">

                                        <SlCalender className='text-xl' />
                                    </div>
                                </div>
                                {
                                    currentUser ? (
                                        products.isBooked === 'Booked' ?
                                            <><span className='bg-primary p-2 px-4 rounded-lg'>This package is booked</span></> :
                                            selectedDate ?
                                                <Link to={`/package/checkout/${pid}/${selectedDate.toISOString().split('T')[0]}`} >
                                                    <button className='bg-primary p-2 px-4 rounded-lg'>Book</button>
                                                </Link>
                                                :
                                                <button className='bg-primary p-2 px-4 rounded-lg' onClick={() => toast.error("Please select the date")}>Book</button>

                                    )
                                        : (
                                            <Link to="/login">
                                                <button className='bg-primary p-2 px-4 rounded-lg'>Book</button>
                                            </Link>
                                        )
                                }
                            </form>
                        }

                    </div>


                </div>

                <div className='h-1 w-full bg-black'>&nbsp;</div>
                <div className="border-2 border-black h-full w-full">
                    <img src={map} alt="" className="h-full w-full" />
                </div>

                {/* Related Product Section */}
                {/* <div className="flex flex-col w-full items-center">
                    <h2 className='text-primary'>Related Products</h2>
                    <div className="grid grid-cols-2 w-full gap-2 mt-6 relative">
                        {related.length > 0 ? (
                            related.map((product, index) => (
                                <div className="flex w-full border-2 border-black" key={product.pid}>
                                    <div className="w-[40%] h-[8rem]">
                                        <img src={`http://localhost:5050${imgArr[index][0]}`} alt="" />
                                    </div>
                                    <div className="flex flex-col p-2 border-l-2 w-[60%] items-center justify-center gap-1">
                                        <span className='text-lg text-primary font-extrabold'>{product.pname}</span>
                                        <span><span className="text-primary font-bold">Price: </span>Rs. {product.price}</span>
                                        <div className="flex justify-center w-full">
                                            <button className='bg-primary p-1 px-2 font-bold rounded-md' onClick={() => handleMore(product.pid)}>More</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h2 className='w-full text-red-600 absolute text-center'>No Related Products Found</h2>
                        )}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default SinglePackage;
