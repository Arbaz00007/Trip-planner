import React, { useEffect, useState } from "react";
import Upper from "./Upper";
import Card from "../global/Card";
import { get } from "../../utils/api";
// import { IoPackage } from 'react-icons/io5';
import { TbLoader } from "react-icons/tb";
import { motion } from "framer-motion";

const Main = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await get("/api/getPosts");
      setData(res);
    } catch (err) {
      setError("Failed to fetch packages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Upper />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-4 mb-8">
          {/* <IoPackage className="text-4xl text-blue-600" /> */}
          <h1 className="text-5xl font-bold text-gray-800">Our Packages</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <TbLoader className="text-4xl text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading amazing destinations...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-2xl font-bold text-red-500">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        ) : data.length > 0 ? (
          <motion.div
            id="explore"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data?.map((item, index) => (
              <motion.div
                key={item.pid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card
                  location={item.location}
                  pname={item.pname}
                  price={item.price}
                  description={item.description}
                  image={item.images?.split(",")[0]}
                  pid={item.pid}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="p-8 text-center bg-red-50 rounded-lg border border-red-100">
            <h1 className="text-3xl font-bold text-red-500">
              No Packages Found
            </h1>
            <p className="mt-2 text-red-400">
              Try exploring again later or adjust your search criteria.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Main;
