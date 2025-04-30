import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiFolderUploadFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { get, post } from "../../utils/api";

export default function UpdatePackageForm() {
  const { pid } = useParams(); // Get package ID from URL params
  console.log(pid,10);
  
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    pac_title: "",
    pac_cost: "",
    pac_description: "",
    pac_time: "",
    location: "",
  });
  const [image, setImage] = useState([]);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await get(`/api/getSinglePost/${pid}`);
        console.log(response, 25);

        const packageData = response;
        setInputs({
          pac_title: packageData.pname,
          pac_cost: packageData.price,
          pac_description: packageData.description,
          pac_time: packageData.time,
          location: packageData.location,
        });
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };
    fetchPackage();
  }, [pid]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      image.forEach((img) => formData.append("images", img));
      formData.append("pname", inputs.pac_title);
      formData.append("price", inputs.pac_cost);
      formData.append("description", inputs.pac_description);
      formData.append("time", inputs.pac_time);
      formData.append("location", inputs.location);

      await post(`/api/update-post/${pid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Package updated successfully");
      navigate("/admin/dashboard/packages");
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error("Failed to update package");
    }
  };

  return (
    <div className="packageFormDiv">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="py-4"
      >
        <h1 className="text-5xl font-bold">Update Package</h1>
        <div className="packageUpDiv">
          <input
            type="text"
            placeholder="Enter Package Title"
            name="pac_title"
            onChange={handleChange}
            value={inputs.pac_title}
          />
          <input
            type="number"
            placeholder="Enter Package Cost"
            name="pac_cost"
            onChange={handleChange}
            value={inputs.pac_cost}
          />
        </div>
        <textarea
          name="pac_description"
          cols="30"
          rows="10"
          placeholder="Describe about your package..."
          onChange={handleChange}
          value={inputs.pac_description}
        />
        <input
          type="text"
          placeholder="Enter Time. E.g. 4 Days - 5 Days"
          name="pac_time"
          onChange={handleChange}
          value={inputs.pac_time}
        />
        <div className="addPackageImage flex w-[90%] gap-4">
          <input
            type="text"
            placeholder="Enter Location. E.g. Nepal, Sunsari"
            name="location"
            onChange={handleChange}
            value={inputs.location}
          />
          <div className="image1 w-1/2">
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
              <RiFolderUploadFill /> &nbsp; Upload new images (optional)
            </label>
          </div>
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
