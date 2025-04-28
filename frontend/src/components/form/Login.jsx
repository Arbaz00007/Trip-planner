import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoGoogle } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import MySvg from "../../image/svg/login.svg";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Validation from "./SigninValidation";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);

  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    // Check for changes in the errors state
    if (errors.email === "" && errors.password === "") {
      setErr("");
    } else {
      setErr(null);
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = Validation(values);

    // // Check for validation errors
    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrors(validationErrors);
      setErr(null);
    } else {
      setErrors({});
      try {
        const res = await login(values);
        console.log(res);
        if (res.status === 400) {
          toast.error(res.data);
        } else {
          toast.success("Login successful");
          navigate("/");
        }
      } catch (err) {
        setErr(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
    // navigate('/');
  };
  // console.log(err);

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full h-[100vh] grid place-items-center">
      <div className="h-[80%] w-[65%]  rounded-xl shadow-2xl flex">
        <div className="h-full w-1/2 flex flex-col items-center">
          <img className="h-[90%] w-full" src={MySvg} alt="MySvg" />
          <NavLink to="/signup">
            <p className="underline font-bold">Create an account</p>
          </NavLink>
        </div>
        <div className="h-full w-1/2 pl-14 pt-14 font-heading">
          <div className="flex flex-col justify-start">
            <h3 className="w-full text-4xl font-bold">Login</h3>
            <form
              action=""
              method="post"
              className="flex flex-col justify-center gap-4 items-start mt-12"
            >
              <div className="flex items-center w-full relative">
                <FaUserAlt className="absolute" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                  className="outline-none font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                  onChange={handleInput}
                  required
                />
              </div>
              {errors.email && (
                <span className="text-red-600">{errors.email}</span>
              )}
              <div className="mt-2 flex items-center w-full relative">
                <RiLockPasswordFill className="absolute" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="outline-none font-semibold border-0 !border-b-2 w-[80%] border-black border-botton px-8"
                  onChange={handleInput}
                  autoComplete="on"
                  required
                />
              </div>
              {errors.password !== "" && (
                <span className="text-red-600">{errors.password}</span>
              )}
              <div className="flex justify-center items-center">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  name="check"
                  id=""
                />{" "}
                <span className="pl-2 font-semibold"> Remember me</span>
              </div>
              <Link to={"/forget-password"}>
                <span>Forget password?</span>
              </Link>
              <span className="text-red-700">{err}</span>
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-primary p-2 px-4 font-bold rounded-sm hover:bg-lightPrimary transition-colors duration-200 mt-8"
              >
                Sign In
              </button>
              <div className="flex gap-4 mt-20">
                <span className="font-semibold">or login with</span>
                <button className="p-1 rounded-md text-white bg-[#276bff]">
                  <FaFacebookF />
                </button>
                <button className="p-1 rounded-md text-white bg-black">
                  <FaXTwitter />
                </button>
                {/* <GoogleAuth /> */}
                <button className="p-1 rounded-md text-white bg-[#DB4437]">
                  <IoLogoGoogle />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
