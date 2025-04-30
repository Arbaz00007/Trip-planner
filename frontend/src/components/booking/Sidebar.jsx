import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CiBookmarkCheck, CiBookmarkPlus, CiBookmarkRemove } from "react-icons/ci";
import { FiSearch, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";

const Sidebar = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const navItems = [
        { path: '/booking', icon: <CiBookmarkCheck className="text-xl" />, label: 'Booking', count: 2 },
        { path: '/booked', icon: <CiBookmarkPlus className="text-xl" />, label: 'Booked', count: 5 },
        { path: '/canceled', icon: <CiBookmarkRemove className="text-xl" />, label: 'Cancelled', count: 1 },
    ];

    return (
        <div className="flex flex-col p-6 gap-4 bg-white rounded-xl shadow-md h-full">
            <div className="relative">
                <input 
                    className="w-full outline-none p-3 pl-10 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    type="search" 
                    placeholder="Search packages..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <FiFilter />
                </button>
            </div>
            
            {isFilterOpen && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-50 p-3 rounded-lg"
                >
                    <h3 className="font-medium mb-2">Filter by:</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input type="checkbox" id="price" className="mr-2" />
                            <label htmlFor="price">Price (Low to High)</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="date" className="mr-2" />
                            <label htmlFor="date">Recent First</label>
                        </div>
                    </div>
                </motion.div>
            )}
            
            <nav className="mt-2">
                <ul className="space-y-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link 
                                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                    location.pathname === item.path 
                                        ? 'bg-primary/10 text-primary font-semibold' 
                                        : 'hover:bg-gray-50'
                                }`} 
                                to={item.path}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                {item.count > 0 && (
                                    <span className="bg-primary/20 text-primary text-xs font-medium px-2 py-1 rounded-full">
                                        {/* {item.count} */}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-sm text-gray-500">Need Help?</h3>
                    <p className="text-xs text-gray-500 mt-1">Contact our customer support for assistance with your bookings.</p>
                    <button className="mt-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar