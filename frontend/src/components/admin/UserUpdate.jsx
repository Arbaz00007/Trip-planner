import MySvg from "../../images/svg/signup.svg";
import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoGoogle } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaAddressBook } from "react-icons/fa6";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const UserUpdate = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  console.log(uid);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    hobby: "",
  });
  console.log(data);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/users/${uid}`
      );
      setData(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData((prevData) => ({ ...prevData, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .put(`http://localhost:8800/api/users/update/${uid}`, data)
      .then((res) => {
        console.log(res);
        navigate("/admin/dashboard/user");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full h-[100vh] grid place-items-center transition ease-in-out duration-700">
      <div className="h-[80%] w-[65%]  rounded-xl shadow-2xl flex">
        <div className="h-full w-1/2 pl-14 pt-14 font-heading">
          <div className="flex flex-col justify-end">
            <h3 className="w-full text-4xl font-bold">Update User</h3>
            <form
              action=""
              method="post"
              className="flex flex-col justify-center gap-4 items-start mt-10"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-5 w-[80%]">
                <div className="flex items-center w-full relative">
                  <FaUserAlt className="absolute" />
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter Full Name"
                    className="font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                    value={data.name}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <FaAddressBook className="absolute" />
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter Full Address"
                    className="font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                    value={data.address}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <FaPhoneSquareAlt className="absolute" />
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder="Enter your phone "
                    className="font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                    value={data.phone}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <MdEmail className="absolute" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email Address"
                    className="font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                    value={data.email}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <RiLockPasswordFill className="absolute" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    className="font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    value={data.password}
                  />
                </div>
              </div>

              <button
                className="bg-[#79db7c] p-2 px-4 font-bold rounded-sm hover:bg-primary transition-colors duration-200 mt-4"
                type="submit"
              >
                Update User
              </button>
            </form>
          </div>
        </div>
        <div className="h-full w-1/2 flex flex-col items-center">
          <img className="h-[90%] w-full" src={MySvg} alt="MySvg" />
        </div>
      </div>
    </div>
  );
};

export default UserUpdate;
