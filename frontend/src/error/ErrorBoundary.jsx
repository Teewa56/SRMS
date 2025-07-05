import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorBoundary({ children }) {
    ErrorBoundary.propTypes = {
        children: PropTypes.node.isRequired,
    };

    const [hasError, setHasError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleError = (event) => {
            console.error("Error caught by ErrorBoundary:", event);
            setHasError(true);
        };

        window.onerror = handleError;

        return () => {
            window.onerror = null;
        };
    }, []);

    const handleReload = () => {
        setHasError(false);
        navigate(0);
    };

    if (!hasError) {
        return children;
    } else {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-purple-400 text-blue-800 ">
                <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg border border-gray-200 max-w-md">
                    <img
                        src="/images/error.svg"
                        alt="Error Illustration"
                        className="w-32 h-32 mb-4"
                    />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Oops! Something went wrong.
                    </h1>
                    <p className="text-gray-600 text-center mb-4">
                        Sorry, it's not you—it's us. Please reload the page or wait while we fix the issue.
                    </p>
                    <button
                        onClick={handleReload}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-600 transition"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }
}