import React, { useContext, useState } from "react";
import "./package.css";
import axios from "axios";
import { RiFolderUploadFill } from "react-icons/ri";
import { AuthContext } from "../../../context/authContext";
import { toast } from "react-toastify";

export default function Packageform() {
  const { currentUser } = useContext(AuthContext);
  console.log();

  const [inputs, setInputs] = useState({
    pac_title: "",
    pac_cost: "",
    pac_description: "",
    pac_time: "",
    location: "",
    uid: parseInt(currentUser?.id),
  });
  const [image, setImage] = useState([]);
  console.log(image, "Images");

  // console.log(inputs);
  const [err, setErr] = useState(null);

  const handleClick = async (e) => {
    e.preventDefault();
    if (image.length < 3 && image.length > 5) {
      toast.error("Upload minimum 3 and maximum 5 images");
    }
    try {
      const formData = new FormData();
      image.forEach((image) => {
        formData.append("images", image); // Name should match multer field in backend
      });

      formData.append("userId", inputs.uid);
      formData.append("pname", inputs.pac_title);
      formData.append("price", inputs.pac_cost);
      formData.append("description", inputs.pac_description);
      formData.append("time", inputs.pac_time);
      formData.append("location", inputs.location);

      formData.forEach((value, key) => {
        if (key === "images") {
          console.log(`${key}: ${value.name}`); // Logging file name
        } else {
          console.log(`${key}: ${value}`);
        }
      });
      console.log(inputs);
      await axios
        .post("http://localhost:5050/api/createPost", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data.message);
          toast.success(response.data.message);
        });

      // console.log("Image uploaded...");
    } catch (err) {
      console.error(err);
    }

    setInputs({
      pac_title: "",
      pac_cost: "",
      pac_description: "",
      pac_time: "",
      location: "",
    });
    setImage(null); // Clear the mainImg file input
  };

  const handleMyChange = (e) => {
    // console.log(inputs);
    // Handle other inputs
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="packageFormDiv">
      <form action="" encType="multipart/form-data" className="py-4">
        <h1 className="text-5xl font-bold">Adding Package</h1>
        <div className="packageUpDiv">
          <input
            type="text"
            placeholder="Enter Package Title"
            name="pac_title"
            onChange={(e) => handleMyChange(e)}
            value={inputs.pac_title}
          />
          <input
            type="number"
            placeholder="Enter Package Cost"
            name="pac_cost"
            onChange={(e) => handleMyChange(e)}
            value={inputs.pac_cost}
          />
        </div>
        <textarea
          style={{ resize: "none" }}
          name="pac_description"
          id=""
          cols="30"
          rows="10"
          placeholder="Describe about your package..."
          onChange={(e) => handleMyChange(e)}
          value={inputs.pac_description}
        />
        <input
          type="text"
          placeholder="Enter Time. E.g. 4 Days - 5 Days"
          name="pac_time"
          onChange={(e) => handleMyChange(e)}
          value={inputs.pac_time}
        />
        <div className="addPackageImage flex w-[90%] gap-4">
          <input
            type="text"
            placeholder="Enter Location. E.g. Nepal, sunsari"
            name="location"
            onChange={(e) => handleMyChange(e)}
            value={inputs.location}
          />
          <div className="image1  w-1/2">
            <input
              className="w-full"
              type="file"
              id="mainImg"
              name="mainImg"
              accept="image/*"
              onChange={(e) => setImage(Array.from(e.target.files))}
              multiple
            />
            <label className="!text-white" htmlFor="mainImg">
              <RiFolderUploadFill /> &nbsp; upload minimum 3 images
            </label>
            {/* <span className="custom-text1">No file selected</span> */}
          </div>
        </div>
        <input type="submit" value="Add" onClick={handleClick} />
      </form>
    </div>
  );
}
