import React, { useContext, useEffect, useState } from 'react'
import BookCard from './BookCard'
import { AuthContext } from '../../context/authContext';
import { get } from '../../utils/api';
import { FiClock, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const Booking = () => {
    const { currentUser } = useContext(AuthContext)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await get(`/api/getBookingByUser/${parseInt(currentUser?.id)}?status=Pending`)
                setData(res)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
                setLoading(false)
            }
        }
        
        fetchData()
    }, [currentUser?.id])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <FiClock className="text-blue-600 text-xl" />
                </div>
                <h1 className='text-3xl font-bold'>Currently Pending Bookings</h1>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {data?.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {data.map((item, index) => (
                                <motion.div key={index} variants={itemVariants}>
                                    <BookCard data={item} type="booking" />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAlertCircle className="text-gray-500 text-2xl" />
                            </div>
                            <h2 className='text-2xl font-bold text-gray-700 mb-2'>No Pending Bookings</h2>
                            <p className="text-gray-500 max-w-md mx-auto">
                                You don't have any pending bookings at the moment. Browse our packages to find your next adventure!
                            </p>
                            <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                Find Packages
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Booking