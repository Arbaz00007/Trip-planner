import MySvg from "../../image/svg/signup.svg";
import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoGoogle } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaAddressBook } from "react-icons/fa6";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { post } from "../../utils/api";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    role_id: 3,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // console.log(values);
  //     axios.post('http://localhost:5050/api/register', values).then((res) => {
  //         // console.log(res)
  //         toast.success(res.data.message);
  //     }).catch((err) => {
  //         console.log(err)
  //     });
  //     navigate('/login');
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await post("/api/register", values);
    console.log(res);

    setLoading(true);
    if (res.message === "OTP sent to your email for verification.") {
      toast.success("Check your email for OTP.");
      navigate(`/verify-otp?email=${values.email}`);
    }
  };
  return (
    <div className="w-full h-[100vh] grid place-items-center transition ease-in-out duration-700">
      <div className="h-[80%] w-[65%]  rounded-xl shadow-2xl flex">
        <div className="h-full w-1/2 pl-14 pt-14 outline-none font-heading">
          <div className="flex flex-col justify-end">
            <h3 className="w-full text-4xl outline-none font-bold">Register</h3>
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
                    className="outline-none font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <FaAddressBook className="absolute" />
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter Full Address"
                    className="outline-none font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <FaPhoneSquareAlt className="absolute" />
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder="Enter your phone "
                    className="outline-none font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <MdEmail className="absolute" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email Address"
                    className="outline-none font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center w-full relative">
                  <RiLockPasswordFill className="absolute" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    className="outline-none font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex justify-center items-center">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  name="check"
                  id=""
                />{" "}
                <span className="pl-2 outline-none font-semibold">
                  {" "}
                  I agree your terms and conditions
                </span>
              </div>
              <button
                className="bg-primary p-2 px-4 outline-none font-bold rounded-sm hover:bg-lightPrimary transition-colors duration-200 mt-4"
                type="submit"
              >
                {loading ? "Loading..." : "Sign Up"}
              </button>
              <div className="flex gap-4 mt-6">
                <span className="outline-none font-semibold">
                  or signup with
                </span>
                <button className="p-1 rounded-md text-white bg-[#276bff]">
                  <FaFacebookF />
                </button>
                <button className="p-1 rounded-md text-white bg-black">
                  <FaXTwitter />
                </button>
                <button className="p-1 rounded-md text-white bg-[#DB4437]">
                  <IoLogoGoogle />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="h-full w-1/2 flex flex-col items-center">
          <img className="h-[90%] w-full" src={MySvg} alt="MySvg" />
          <NavLink to="/login">
            <p className="underline outline-none font-bold">
              Already have an account?
            </p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Signup;
