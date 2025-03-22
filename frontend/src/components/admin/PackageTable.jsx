import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { get, post } from "../../utils/api";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const PackageTable = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const res = await get("/api/getPosts");
    console.log(res, "Response");
    setData(res);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const navigate = useNavigate();
  const handleUpdate = async (id) => {};

  const handleDelete = async (id) => {
    console.log(id, 22);

    const res = await post(`/api/delete-post/${parseInt(id)}`);
    console.log(res, " :Response", 23);
    fetchData();
    toast.success("Package deleted successfully");
  };

  return (
    <div>
      <div className="flex justify-end mr-10 my-9">
        <Link to="/admin/dashboard/add-package">
          <button className="bg-primary px-2 h-10 rounded-md hover:bg-green-600 my-transition font-bold shadow-md">
            Add Package
          </button>
        </Link>
      </div>
      <h2 className="text-primary ml-3 text-4xl font-bold">Package's List</h2>
      <table className="min-w-full text-left text-sm font-light mt-6">
        <thead className="border-b font-medium dark:border-neutral-500">
          <tr>
            <th scope="col" className="px-6 py-4">
              #
            </th>
            <th scope="col" className="px-6 py-4">
              Title
            </th>
            <th scope="col" className="px-6 py-4">
              Description
            </th>
            <th scope="col" className="px-6 py-4">
              Price
            </th>
            <th scope="col" className="px-6 py-4">
              Location
            </th>
            <th scope="col" className="px-6 py-4">
              Time
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
                <td className="whitespace-nowrap px-6 py-4">{item.pname}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  {item.description.slice(0, 32) + "..."}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{item.price}</td>
                <td className="whitespace-nowrap px-6 py-4">{item.location}</td>
                <td className="whitespace-nowrap px-6 py-4">{item.time}</td>
                <td className="whitespace-nowrap px-6 py-4 flex gap-2">
                  <button
                    className="flex items-center gap-1  text-blue-500 font-md border border-blue-500 px-4 py-1 rounded-sm"
                    onClick={() =>
                      navigate(`/admin/dashboard/update-package/${item.pid}`)
                    }
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    className="flex items-center gap-1   text-red-600 font-md border border-red-600 px-4 py-1 rounded-sm"
                    onClick={() => handleDelete(item.pid)}
                  >
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

export default PackageTable;
