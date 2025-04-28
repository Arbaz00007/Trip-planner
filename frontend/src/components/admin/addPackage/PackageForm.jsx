import React, { useContext, useState } from "react";
import "./package.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/authContext";
import {
  RiFolderUploadFill,
  RiDeleteBin6Line,
  RiAddCircleLine,
  RiMapPinLine,
  RiMoneyDollarCircleLine,
  RiTimeLine,
  RiFileTextLine,
  RiImageAddLine,
  RiInformationLine,
  RiQuestionAnswerLine,
  RiArrowGoBackLine,
  RiSaveLine,
  RiCalendarCheckLine,
} from "react-icons/ri";

export default function PackageForm() {
  const { currentUser } = useContext(AuthContext);

  const [itinerary, setItinerary] = useState([
    { place: "", duration: "", admission: true },
  ]);

  const [inputs, setInputs] = useState({
    pac_title: "",
    pac_cost: "",
    pac_description: "",
    pac_time: "",
    location: "",
    uid: parseInt(currentUser?.id),
    included: "",
    expect: "",
    returned: "",
  });

  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItineraryChange = (index, key, value) => {
    const updated = [...itinerary];
    updated[index][key] = value;
    setItinerary(updated);
  };

  const addItinerary = () => {
    setItinerary([...itinerary, { place: "", duration: "", admission: true }]);
  };

  const removeItinerary = (index) => {
    const updated = [...itinerary];
    updated.splice(index, 1);
    setItinerary(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImage(files);

    // Create image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeImage = (index) => {
    const updatedImages = [...image];
    const updatedPreviews = [...imagePreview];

    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setImage(updatedImages);
    setImagePreview(updatedPreviews);
  };

  const handleInputChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      image.forEach((img) => {
        formData.append("images", img);
      });

      formData.append("userId", currentUser.id);
      formData.append("pname", inputs.pac_title);
      formData.append("price", inputs.pac_cost);
      formData.append("description", inputs.pac_description);
      formData.append("time", inputs.pac_time);
      formData.append("location", inputs.location);
      formData.append("included", inputs.included);
      formData.append("expect", inputs.expect);
      formData.append("returned", inputs.returned);
      formData.append("itinerary", JSON.stringify(itinerary));

      const response = await axios.post(
        "http://localhost:5050/api/createPost",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(response.data.message);

      // Reset form
      setInputs({
        pac_title: "",
        pac_cost: "",
        pac_description: "",
        pac_time: "",
        location: "",
        uid: parseInt(currentUser?.id),
        included: "",
        expect: "",
        returned: "",
      });
      setImage([]);
      setImagePreview([]);
      setItinerary([{ place: "", duration: "", admission: true }]);
    } catch (err) {
      toast.error("Failed to create package");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-lg max-w-6xl mx-auto">
      <form
        className="space-y-8"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-indigo-600">
            Create New Travel Package
          </h1>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-all"
          >
            <RiSaveLine /> {isSubmitting ? "Saving..." : "Save Package"}
          </button>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <RiInformationLine className="mr-2 text-indigo-500" size={24} />{" "}
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter an attractive title"
                  name="pac_title"
                  value={inputs.pac_title}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <RiFileTextLine className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Cost
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter package cost"
                  name="pac_cost"
                  value={inputs.pac_cost}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <RiMoneyDollarCircleLine className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="E.g. 4 Days - 5 Nights"
                  name="pac_time"
                  value={inputs.pac_time}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <RiTimeLine className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="E.g. Nepal, Sunsari"
                  name="location"
                  value={inputs.location}
                  onChange={handleInputChange}
                  className="w-full py-3 px-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <RiMapPinLine className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Description
            </label>
            <textarea
              name="pac_description"
              placeholder="Describe your package in detail..."
              value={inputs.pac_description}
              onChange={handleInputChange}
              rows="5"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              style={{ resize: "none" }}
            ></textarea>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <RiImageAddLine className="mr-2 text-indigo-500" size={24} />{" "}
            Package Images
          </h2>

          <div className="file-upload-container">
            <label
              htmlFor="packageImages"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <RiFolderUploadFill className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  Upload 3-5 high-quality images (PNG, JPG)
                </p>
              </div>
              <input
                id="packageImages"
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {imagePreview.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Selected Images ({imagePreview.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {imagePreview.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="h-24 w-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Itinerary Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <RiCalendarCheckLine className="mr-2 text-indigo-500" size={24} />{" "}
            Itinerary Details
          </h2>

          {itinerary.map((item, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Stop {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeItinerary(index)}
                  className="text-red-500 hover:text-red-700 flex items-center"
                  disabled={itinerary.length <= 1}
                >
                  <RiDeleteBin6Line className="mr-1" /> Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="input-group">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Place Name"
                      value={item.place}
                      onChange={(e) =>
                        handleItineraryChange(index, "place", e.target.value)
                      }
                      className="w-full py-2 px-4 pl-9 border border-gray-300 rounded-lg"
                    />
                    <RiMapPinLine className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="input-group">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Duration (e.g., 60 minutes)"
                      value={item.duration}
                      onChange={(e) =>
                        handleItineraryChange(index, "duration", e.target.value)
                      }
                      className="w-full py-2 px-4 pl-9 border border-gray-300 rounded-lg"
                    />
                    <RiTimeLine className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                </div>

                <div className="input-group">
                  <select
                    value={item.admission}
                    onChange={(e) =>
                      handleItineraryChange(
                        index,
                        "admission",
                        e.target.value === "true"
                      )
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg appearance-none bg-white"
                  >
                    <option value="true">Admission Included</option>
                    <option value="false">Admission Not Included</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItinerary}
            className="flex items-center gap-1 mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <RiAddCircleLine size={20} /> Add Another Stop
          </button>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <RiQuestionAnswerLine className="mr-2 text-indigo-500" size={24} />{" "}
            Additional Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What's Included
              </label>
              <textarea
                name="included"
                placeholder="Detail what's included in this package (transportation, meals, accommodations, etc.)"
                value={inputs.included}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                style={{ resize: "none" }}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What to Expect
              </label>
              <textarea
                name="expect"
                placeholder="Describe what travelers should expect from this package (activities, sights, experiences)"
                value={inputs.expect}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                style={{ resize: "none" }}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure & Return
              </label>
              <textarea
                name="returned"
                placeholder="Provide details about departure and return logistics (meeting points, drop-off locations, times)"
                value={inputs.returned}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                style={{ resize: "none" }}
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg transition-all text-lg"
          >
            <RiSaveLine />{" "}
            {isSubmitting ? "Creating Package..." : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
