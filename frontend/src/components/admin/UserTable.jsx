import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { get } from "../../utils/api";

const UserTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await get("/api/getAllUsers");
    console.log(res, "Response");
    setData(res);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleUpdate = (uid) => {
    console.log(uid);
    // Navigate to the update page with user_id
    navigate(`/admin/dashboard/update-user/${uid}`);
  };

  return (
    <div>
      <div className="flex justify-end mr-10 my-9">
        <Link to="/admin/dashboard/add-user">
          <button className="bg-primary px-2 h-10 rounded-md hover:bg-green-600 my-transition font-bold shadow-md">
            Add User
          </button>
        </Link>
      </div>
      <h2 className="text-primary ml-3 text-4xl font-bold">User's List</h2>
      <table className="min-w-full text-left text-sm font-light mt-6">
        <thead className="border-b font-medium dark:border-neutral-500">
          <tr>
            <th scope="col" className="px-6 py-4">
              #
            </th>
            <th scope="col" className="px-6 py-4">
              Name
            </th>
            <th scope="col" className="px-6 py-4">
              Email
            </th>
            <th scope="col" className="px-6 py-4">
              Address
            </th>
            <th scope="col" className="px-6 py-4">
              Phone
            </th>
            <th scope="col" className="px-6 py-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr
                key={index}
                className="border-b transition duration-300 ease-in-out "
              >
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {index + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{item.name}</td>
                <td className="whitespace-nowrap px-6 py-4">{item.email}</td>
                <td className="whitespace-nowrap px-6 py-4">{item.address}</td>
                <td className="whitespace-nowrap px-6 py-4">{item.phone}</td>
                <td className="whitespace-nowrap px-6 py-4 flex gap-2">
                  <button
                    className="flex items-center gap-1  text-blue-500 font-md border border-blue-500 px-4 py-1 rounded-sm"
                    onClick={() => handleUpdate(item.uid)}
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center gap-1   text-red-600 font-md border border-red-600 px-4 py-1 rounded-sm">
                    <MdDelete />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
