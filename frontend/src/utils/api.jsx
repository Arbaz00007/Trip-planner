import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// Debug to verify environment variable
// console.log("API Base URL:", process.env.REACT_APP_HOST);

const api = axios.create({
    baseURL: `http://localhost:5050`, // Ensure REACT_APP_HOST is defined in .env
    withCredentials: true, // For cookies/auth
    headers: {
        "Content-Type": "application/json", // Ensures proper JSON communication
    },
});

// Utility function to retrieve the access token from cookies using js-cookie
const getAuthTokenFromCookies = () => {
    const token = Cookies.get("accessToken")
    return token // Retrieve token directly using js-cookie
};

// Function to handle GET requests
export const get = async (endpoint, params = {}) => {
    try {
        const token = getAuthTokenFromCookies(); // Get the token from cookies

        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const response = await api.get(endpoint, { params, headers });
        console.log(response);

        return response.data; // Return data from the response
    } catch (error) {
        handleError(error);
        throw error; // Re-throw error for further handling
    }
};

// Function to handle POST requests
export const post = async (endpoint, body = {}) => {
    try {
        const token = getAuthTokenFromCookies(); // Get the token from cookies
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const response = await api.post(endpoint, body, { headers });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// Function to handle PUT requests
export const put = async (endpoint, body = {}) => {
    try {
        const token = getAuthTokenFromCookies(); // Get the token from cookies
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const response = await api.put(endpoint, body, { headers });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// Function to handle DELETE requests
export const del = async (endpoint) => {
    try {
        const token = getAuthTokenFromCookies(); // Get the token from cookies
        const headers = token ? { "Authorization": `Bearer ${token}` } : {};

        const response = await api.delete(endpoint, { headers });
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

// Utility function for handling errors
const handleError = (error) => {
    console.error("API Error:", error.response || error.message);
    toast.error(error.response?.data || "An error occurred. Please try again.");
    // alert(error.response?.data?.message || "An error occurred. Please try again.");
};
