import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../utils/api";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Package,
  Plus,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { AuthContext } from "../../context/authContext";

const PackageTable = () => {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await get("/api/getPosts");
      setData(res);
      setFilteredData(res);
    } catch (error) {
      toast.error("Failed to fetch packages");
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (!searchQuery.trim()) {
        setFilteredData(data);
        return;
      }

      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = data.filter(
        (item) =>
          item.pname?.toLowerCase().includes(lowercaseQuery) ||
          item.description?.toLowerCase().includes(lowercaseQuery) ||
          item.location?.toLowerCase().includes(lowercaseQuery) ||
          String(item.price).includes(lowercaseQuery)
      );
      setFilteredData(filtered);
    };

    filterData();
  }, [searchQuery, data]);

  const handleUpdate = (id) => {
    navigate(`/admin/dashboard/update-package/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(id);
      const res = await post(`/api/delete-post/${parseInt(id)}`);
      if (res) {
        await fetchData();
        toast.success("Package deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete package");
      console.error("Error deleting package:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Package className="text-blue-600 mr-3 h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-800">
              Package Management
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title="Refresh packages"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            {currentUser?.role_id === 1 ? (
              <button
                onClick={() => navigate("/admin/dashboard/add-package")}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                <Plus className="mr-1 h-5 w-5" />
                Add Package
              </button>
            ) : (
              <button
                onClick={() => navigate("/guider/dashboard/add-package")}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                <Plus className="mr-1 h-5 w-5" />
                Add Package
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative flex-grow max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search packages by name, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="ml-4 text-sm text-gray-500">
            {filteredData.length} packages found
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading packages...</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No packages found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Add a new package to get started"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr
                  key={item.pid}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{item.pid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium uppercase">
                        {item.pname?.charAt(0) || "P"}
                      </div>
                      <div className="ml-4 text-sm font-medium text-gray-900">
                        {item.pname}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truncateText(item.description, 32)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleUpdate(item.pid)}
                        className="inline-flex items-center px-3 py-1 border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.pid)}
                        className="inline-flex items-center px-3 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                        disabled={isDeleting === item.pid}
                      >
                        {isDeleting === item.pid ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PackageTable;
