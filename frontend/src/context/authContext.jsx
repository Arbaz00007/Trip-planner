import { createContext, useEffect, useState } from "react";
import { post } from "../utils/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    const [fetchMessage, setFetchMessage] = useState(null);

    const login = async (inputs) => {
        const res = await post('/api/login', inputs);
        setCurrentUser(res.others);
        return res;
        // console.log(res);

    };

    const logout = async () => {
        localStorage.removeItem("user");
        const res = await post('/api/logout');
        setFetchMessage(res.message);
        setCurrentUser(null);
        toast.success("Logout sucessfully");
    };

    useEffect(() => {
        // Only set the item in localStorage if currentUser is not null
        if (currentUser) {
            localStorage.setItem("user", JSON.stringify(currentUser));
        }
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, fetchMessage }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };
