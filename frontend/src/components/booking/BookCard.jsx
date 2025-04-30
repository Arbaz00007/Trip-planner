import React, { useEffect, useState } from 'react'
import { get } from '../../utils/api'
import { IoLocationOutline } from 'react-icons/io5'
import { FiCalendar, FiClock, FiDollarSign, FiEye, FiXCircle } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookCard = ({ data, type }) => {
    const navigate = useNavigate();
    const [img, setImg] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);

    function splitImagePaths(imageString) {
        return imageString ? imageString.split(',') : [];
    }

    useEffect(() => {
        const images = splitImagePaths(data?.images);
        setImg(images);
        
        // Simulate image loading
        const image = new Image();
        image.onload = () => setLoading(false);
        image.onerror = () => setLoading(false);
        
        if (images[0]) {
            image.src = `http://localhost:5050${images[0]}`;
        } else {
            setLoading(false);
        }
    }, [data?.images]);

    // Status badge
    const StatusBadge = () => {
        let bgColor = "bg-blue-100 text-blue-700";
        let icon = <FiClock className="mr-1" />;
        let text = "Pending";
        
        if (type === 'booked') {
            bgColor = "bg-green-100 text-green-700";
            icon = <FiCalendar className="mr-1" />;
            text = "Completed";
        } else if (type === 'cancel') {
            bgColor = "bg-red-100 text-red-700";
            icon = <FiXCircle className="mr-1" />;
            text = "Cancelled";
        }
        
        return (
            <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${bgColor}`}>
                {icon}
                {text}
            </span>
        );
    };

    return (
        <motion.div 
            className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 transition-all h-full"
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    {loading ? (
                        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    ) : (
                        <>
                            <img 
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out" 
                                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                                src={img[0] ? `http://localhost:5050${img[0]}` : '/placeholder-image.jpg'} 
                                alt={data.pname || "Travel package"} 
                            />
                            
                            <div className="absolute top-3 right-3">
                                <StatusBadge />
                            </div>
                        </>
                    )}
                </div>
                
                {/* Content Section */}
                <div className="flex flex-col p-4 flex-grow">
                    <h2 className="text-xl font-bold text-primary mb-1">{data.pname}</h2>
                    
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <IoLocationOutline className="mr-1" />
                        <span>{data.location}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {data.description?.slice(0, 100) + (data.description?.length > 100 ? '...' : '')}
                    </p>
                    
                    <div className="flex items-center mt-auto">
                        <div className="flex items-center text-primary font-bold mr-auto">
                            <FiDollarSign className="mr-1" />
                            <span>Rs. {data.price?.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                            {type === 'booked' && (
                                <button 
                                    className="p-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg text-white text-sm font-medium transition-colors flex items-center"
                                    onClick={() => console.log("Cancel booking")}
                                >
                                    <FiXCircle className="mr-1" />
                                    Cancel
                                </button>
                            )}
                            
                            <button 
                                className="p-2 px-4 bg-primary hover:bg-primary/90 rounded-lg text-white text-sm font-medium transition-colors flex items-center" 
                                onClick={() => navigate(`/packages/our-package/${data.pid}`)}
                            >
                                <FiEye className="mr-1" />
                                View
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookCard;