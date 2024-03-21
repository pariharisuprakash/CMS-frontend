// import React, { useState } from 'react';
import { createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { toast } from 'react-toastify';
import React, { useState } from 'react';
import  {  useEffect } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import ToastContext from "./ToastContext";

const AuthContext = createContext();

 export const AuthContextProvider = ({children}) =>{
    const { toast } = useContext(ToastContext);
    const navigate = useNavigate();
    const location = useLocation();

     const [user, setUser] = useState(null);
    //  const [error, setError] = useState(null);
    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn =  async () => {
       
        try {
            const res = await  fetch(`http://localhost:9000/api/me`, {
              method: "GET",
              headers: {
                Authorization:`Bearer ${localStorage.getItem("token")}`,
              },  
            });
            const result = await res.json();
            if(!result.error) {
                if (
                    location.pathname === "/login" ||
                    location.pathname === "/register"
                ) {
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 500);
                } else {
                    navigate(location.pathname ? location.pathname : "/");
                }
                setUser(result);
            } else {
                navigate("/login", { replace: true });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loginUser = async (userData) => {
        try {
            const res = await fetch(`http://localhost:9000/api/login`, {
                method:"Post",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...userData}),
            });
            const result = await res.json();
            if (!result.error) {
                //console.log(result);
                localStorage.setItem("token", result.token);
                setUser(result.user);
                toast.success(`Logged in ${result.user.name}`);

                navigate("/", {replace: true });
            } else {
                toast.error(result.error);
                // setError(result.error);
                // toast.error(error);
                // setError(null);
            }
        } catch (err) {
            console.log(err);
        }
    };


    const registerUser = async (userData) => {
        try {
            const res = await fetch(`http://localhost:9000/api/register`, {
                method:"Post",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({...userData}),
            });
            const result = await res.json();
            if (!result.error) {
                toast.success("user registered successful! login into your account!");
                navigate("/login", { replace: true});
            } else {
                toast.error(result.error);
            }
            
        } catch (err) {
            console.log(err);
        }
    };

    return (
    <AuthContext.Provider value={{ loginUser, registerUser, user, setUser}}>
        {children}
    </AuthContext.Provider>
    );
};



export default AuthContext;

