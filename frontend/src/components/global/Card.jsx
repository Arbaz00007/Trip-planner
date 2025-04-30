import React from "react";
import {
  IoLocationOutline,
  IoPricetag,
  IoHeartOutline,
  IoHeart,
  IoCalendarOutline,
} from "react-icons/io5";
import { FaRegClock, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Card = ({ pname, location, price, description, image, pid }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-64">
        <img
          src={`http://localhost:5050${image}`}
          alt={pname}
          className="w-full h-full object-cover transition-all duration-700"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleFavorite}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            {isFavorite ? (
              <IoHeart className="text-xl text-red-500" />
            ) : (
              <IoHeartOutline className="text-xl text-gray-600" />
            )}
          </button>
        </div>
        {/* <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
        
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-300" />
            <span>{(4 + Math.random()).toFixed(1)}</span>
          </div>
        </div> */}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-bold text-xl text-gray-800 line-clamp-1">
            {pname}
          </h2>
        </div>

        <div className="flex items-center gap-1 text-gray-500 mb-4">
          <IoLocationOutline className="text-lg text-blue-600" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="mb-4 h-16 overflow-hidden">
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <FaRegClock className="text-blue-600" />
            <span className="text-xs text-gray-500">5-7 days</span>
          </div>
          <div className="flex items-center gap-1">
            <IoCalendarOutline className="text-blue-600" />
            <span className="text-xs text-gray-500">Available Now</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <IoPricetag className="text-blue-600" />
            <span className="text-lg font-bold text-gray-800">Rs. {price}</span>
          </div>

          <Link to={`/packages/our-package/${pid}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
