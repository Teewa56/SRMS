import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { adminSignIn, createAdminAccount } from '../api/adminApi';
import { lecturerSignIn } from '../api/lecturerApi';
import { studentSignIn } from '../api/studentApi';
import handleApiError from '../apiErrorHandler';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const userId = localStorage.getItem('userId');
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (userId) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, [userId]);

    async function LogInadmin(userInfo) {
        setError(null);
        try {
            const res = await adminSignIn(userInfo);
            const data = res;
            localStorage.setItem('userId', data.data.admin._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'admin');
        } catch (err) {
            console.error("Full error object:", err);
            if (err.response) {
                const status = err.response.status;
                console.log("HTTP Status:", status);
                 if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                }else if (status === 404) {
                    setError("Invalid credentials. Please check your username and id.");
                }else if (status === 401) {
                    setError("Invalid credentials. Please check your username and id.");
                } else if (status === 500) {
                    setError("Server error. Please try again later.");
                } else {
                    setError("An unexpected error occurred.");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server. Check your internet connection.");
            } else {
                console.error("Error", err.message);
                setError("Request failed. Please try again.");
            }
        }
    }

    async function LogInlecturer(userInfo) {
        setError(null);
        try {
            const res = await lecturerSignIn(userInfo);
            const data = res;
            localStorage.setItem('userId', data.data.lecturer._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'lecturer');
        } catch (err) {
            console.error("Full error object:", err);
            if (err.response) {
                const status = err.response.status;
                console.log("HTTP Status:", status);
                if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                }else if (status === 404) {
                    setError("Invalid credentials. Please check your username and id.");
                }else if (status === 401) {
                    setError("Invalid credentials. Please check your username and id.");
                } else if (status === 500) {
                    setError("Server error. Please try again later.");
                } else {
                    setError("An unexpected error occurred.");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server. Check your internet connection.");
            } else {
                console.error("Error", err.message);
                setError("Request failed. Please try again.");
            }
            setIsAuth(false);
        }
    }

    async function LogInstudent(userInfo) {
        setError(null);
        try {
            const res = await studentSignIn(userInfo);
            const data = res;
            localStorage.setItem('userId', data.data.student._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'student');
        } catch (err) {
            console.error("Full error object:", err);
            if (err.response) {
                const status = err.response.status;
                console.log("HTTP Status:", status);
                   if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                }else if (status === 404) {
                    setError("Invalid credentials. Please check your username and id.");
                }else if (status === 401) {
                    setError("Invalid credentials. Please check your username and id.");
                } else if (status === 500) {
                    setError("Server error. Please try again later.");
                } else {
                    setError("An unexpected error occurred.");
                }
            } else if (err.request) {
                console.error("No response received:", err.request);
                setError("No response from server. Check your internet connection.");
            } else {
                console.error("Error", err.message);
                setError("Request failed. Please try again.");
            }
            setIsAuth(false);
        }
    }

    async function createAdmin(userInfo) {
        setError(null);
        try {
            const res = await createAdminAccount(userInfo);
            const data = res;
            localStorage.setItem('userId', data.data.admin._id);
            setIsAuth(true);
            localStorage.setItem('userType', 'admin');
        } catch (err) {
            handleApiError(err, setError, "Failed to create admin account. Please try again.");
        }
    }

    function Logout() {
        setError(null);
        localStorage.clear();
        window.location.href = '/';
        setIsAuth(false);
    }

    return (
        <AuthContext.Provider value={{ LogInstudent, LogInlecturer, LogInadmin, Logout, createAdmin, isAuth, error }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export { AuthContext, AuthProvider };