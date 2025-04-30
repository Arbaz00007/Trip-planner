import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { get, post } from "../../utils/api";
import { toast } from "react-toastify";
import {
  Pencil,
  Trash2,
  Users,
  Plus,
  Loader2,
  RefreshCw,
  Search,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const UserTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await get("/api/getAllUsers");
      setData(res);
      setFilteredData(res);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("Error fetching users:", error);
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
          item.name?.toLowerCase().includes(lowercaseQuery) ||
          item.email?.toLowerCase().includes(lowercaseQuery) ||
          item.address?.toLowerCase().includes(lowercaseQuery) ||
          item.phone?.includes(lowercaseQuery)
      );
      setFilteredData(filtered);
    };

    filterData();
  }, [searchQuery, data]);

  const handleUpdate = (uid) => {
    console.log(uid, "UID from handleUpdate");

    navigate(`/admin/dashboard/update-user/${uid}`);
  };

  const handleDelete = async (uid) => {
    try {
      setIsDeleting(uid);
      await post(`/api/delete-user/${parseInt(uid)}`);
      await fetchData();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Get background color based on initials
  const getInitialsColor = (initials) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-yellow-100 text-yellow-600",
      "bg-pink-100 text-pink-600",
      "bg-indigo-100 text-indigo-600",
    ];

    const charCode = initials.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Users className="text-blue-600 mr-3 h-6 w-6" />
            <h2 className="text-2xl font-bold text-gray-800">
              User Management
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
              title="Refresh users"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative flex-grow max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, address, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="ml-4 text-sm text-gray-500">
            {filteredData.length} users found
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading users...</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16">
          <Users className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Add a new user to get started"}
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
                  Contact Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => {
                const initials = getInitials(item.name);
                const initialsColor = getInitialsColor(initials);

                return (
                  <tr
                    key={item.uid || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{item.uid || index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full ${initialsColor} flex items-center justify-center font-medium`}
                        >
                          {initials}
                        </div>
                        <div className="ml-4 text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Mail className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          {item.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                          {item.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                        {item.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="inline-flex items-center px-3 py-1 border border-blue-200 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                          disabled={isDeleting === item.uid}
                        >
                          {isDeleting === item.uid ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
