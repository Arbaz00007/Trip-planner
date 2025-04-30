import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import image from '../../image/svg/booked.svg';
import { 
  IoHomeOutline, 
  IoCalendarOutline, 
  IoTicketOutline, 
  IoPersonOutline, 
  IoMailOutline, 
  IoCallOutline, 
  IoPrintOutline,
  IoShareSocialOutline,
  IoChevronForwardOutline,
  IoLocationOutline
} from "react-icons/io5";

const Finished = () => {
    const { pid } = useParams();
    const [data, setData] = useState({});
    const [imageArr, setImageArr] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [date, setDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5050/api/getSinglePost/${pid}`);
            setData(response.data);
            
            // Ensure correct image paths
            const images = splitImagePaths(response.data?.images);
            setImageArr(images);
            if (images.length > 0) {
                setActiveImage(images[0]);
            }

            // Proper date formatting
            let inputDate = new Date(response.data.date);
            let formattedDate = inputDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            setDate(formattedDate);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pid]);

    function splitImagePaths(imageString) {
        return imageString ? imageString.replace(/\\/g, '/').split(',') : [];
    }

    // Format price with commas
    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Success Banner */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="p-6 bg-gradient-to-r from-[#8870e6] to-blue-600 flex items-center">
                        <div className="bg-white p-3 rounded-full mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white text-2xl font-bold">Booking Confirmed!</h2>
                            <p className="text-blue-100">Your adventure is booked and ready to go.</p>
                        </div>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="w-full py-20 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Image and Booking Summary */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={activeImage ? `http://localhost:5050${activeImage}` : image} 
                                        alt="Package" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h1 className="text-white text-xl font-bold">{data.pname}</h1>
                                        <p className="text-gray-200 flex items-center">
                                            <IoLocationOutline className="mr-1" /> {data.location || 'Location information'}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Thumbnail Gallery */}
                                {imageArr.length > 0 && (
                                    <div className="p-4 grid grid-cols-4 gap-2">
                                        {imageArr.map((img, index) => (
                                            <div 
                                                key={index} 
                                                className={`h-16 rounded overflow-hidden cursor-pointer border-2 ${
                                                    activeImage === img ? 'border-green-500' : 'border-transparent'
                                                }`}
                                                onClick={() => setActiveImage(img)}
                                            >
                                                <img 
                                                    src={`http://localhost:5050${img}`} 
                                                    alt={`Package view ${index+1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* Booking Summary */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-800">Booking Summary</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <div className="flex items-center">
                                                <IoTicketOutline className="text-blue-600 mr-3" />
                                                <span className="text-gray-600">Package</span>
                                            </div>
                                            <span className="font-medium text-gray-800">{data.pname}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <div className="flex items-center">
                                                <IoCalendarOutline className="text-blue-600 mr-3" />
                                                <span className="text-gray-600">Date</span>
                                            </div>
                                            <span className="font-medium text-gray-800">{date}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="text-blue-600 mr-3">Rs</div>
                                                <span className="text-gray-600">Price</span>
                                            </div>
                                            <span className="font-bold text-lg text-gray-800">Rs. {formatPrice(data.price)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Booking ID */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="p-6 text-center">
                                    <p className="text-gray-500 mb-1">Booking ID</p>
                                    <p className="text-xl font-mono font-bold text-gray-800">BK-{pid}-{Math.floor(Math.random() * 1000)}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column - Contact Info and Actions */}
                        <div className="w-full lg:w-1/2">
                            {/* Contact Info */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <IoPersonOutline className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Name</p>
                                                <p className="font-medium text-gray-800">{data.name}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <IoMailOutline className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium text-gray-800">{data.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                <IoCallOutline className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium text-gray-800">{data.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Important Information */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-800">Important Information</h2>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3 text-gray-700">
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Please arrive 15 minutes before the scheduled time.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Bring a valid ID for verification.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Save this confirmation page for your records.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <button 
                                    onClick={handlePrint}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex justify-center items-center"
                                >
                                    <IoPrintOutline className="mr-2" /> Print Confirmation
                                </button>
                                <Link 
                                    to='/' 
                                    className="flex-1 bg-[#8870e6] hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center"
                                >
                                    <IoHomeOutline className="mr-2" /> Return Home
                                </Link>
                            </div>
                            
                            {/* Explore More */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-6">
                                    <h3 className="font-medium text-gray-800 mb-4">Explore more packages</h3>
                                    <Link 
                                        to="/packages" 
                                        className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
                                    >
                                        <span className="text-gray-700">View all available packages</span>
                                        <IoChevronForwardOutline className="text-gray-500" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Finished;