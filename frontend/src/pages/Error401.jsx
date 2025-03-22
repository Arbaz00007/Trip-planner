import React from "react";
import svg from "../image/svg/401error.svg";
import { Link } from "react-router-dom";

const Error401 = () => {
  return (
    <div className="h-[90%] w-full flex flex-col justify-center items-center">
      <img className="h-full w-full" src={svg} alt="" />
      <Link to="/">
        <button className="p-2 px-4 bg-primary rounded-md font-bold">
          Go To Home
        </button>
      </Link>
    </div>
  );
};

export default Error401;
