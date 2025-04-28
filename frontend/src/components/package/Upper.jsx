import React, { useEffect, useState, useRef } from "react";
import Mysvg from "../../image/svg/package.svg";
import { FaSearch, FaLongArrowAltDown } from "react-icons/fa";
import { MdExplore, MdTravelExplore } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { get } from "../../utils/api";
import Card from "../global/Card";

const Upper = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchData();
    // Handle clicks outside search container
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const res = await get("/api/getPosts");
      setData(res);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      setShowSearch(true);
      setLoading(true);

      // Simulate search results with timeout
      setTimeout(() => {
        const filteredResults = data.filter(
          (item) =>
            item.pname.toLowerCase().includes(query.toLowerCase()) ||
            item.location.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
        setLoading(false);
      }, 300);
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <div className="z-0 h-[calc(100vh-8rem)] w-full max-w-7xl flex flex-col lg:flex-row justify-center items-center px-4">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-4 lg:mt-0 h-1/2 lg:h-3/4 object-contain"
          src={Mysvg}
          alt="Travel illustration"
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Adventure Awaiting You
          </h1>

          <p className="text-xl md:text-2xl text-gray-600">
            Unveiling Destinations, Creating Unforgettable Stories
          </p>

          <div className="flex flex-col md:flex-row items-center gap-6 justify-center lg:justify-start">
            <motion.a
              href="#explore"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="flex justify-center items-center gap-2 py-3 px-6 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all font-bold text-white shadow-lg shadow-blue-200">
                <span>Explore Now</span>
                <MdTravelExplore className="text-2xl" />
              </button>
            </motion.a>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center"
            >
              <FaLongArrowAltDown className="text-3xl text-blue-600" />
              <span className="font-medium text-gray-600 mt-2">
                Scroll Down
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div ref={searchRef} className="relative w-full max-w-xl px-4 z-10">
        <div className="relative">
          <input
            onChange={handleSearch}
            value={searchQuery}
            className="rounded-full font-medium outline-none w-full p-4 pl-12 pr-10 shadow-lg border border-gray-200 focus:border-blue-400 transition-all"
            type="search"
            placeholder="Search your dream destination..."
          />
          <div className="absolute top-0 left-0 h-full flex items-center pl-4">
            <FaSearch className="text-gray-500 text-lg" />
          </div>
          {searchQuery.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowSearch(false);
              }}
              className="absolute top-0 right-0 h-full flex items-center pr-4"
            >
              <FiX className="text-gray-500 text-lg hover:text-gray-700" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-0 right-0 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 mx-4"
            >
              {loading ? (
                <div className="flex justify-center items-center p-4">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.slice(0, 5).map((item) => (
                    <a
                      key={item.pid}
                      href={`/packages/our-package/${item.pid}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-all"
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={`http://localhost:5050${
                            item.images?.split(",")[0]
                          }`}
                          alt={item.pname}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">
                          {item.pname}
                        </h3>
                        <p className="text-gray-500 text-sm">{item.location}</p>
                      </div>
                      <div className="font-bold text-blue-600">
                        Rs.{item.price}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Upper;
