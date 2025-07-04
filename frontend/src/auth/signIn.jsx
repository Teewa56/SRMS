import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import Loading from '../components/Loaidng';
import {useNavigate, Link} from 'react-router-dom';

export default function SignIn() {
    const userType = localStorage.getItem('userType');
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
    });
    const { LogInstudent, LogInlecturer, LogInadmin, error, isAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth && userType) {
            navigate(`/${userType}`);
        }
    }, [isAuth, userType, navigate]);

    function updateUserInfo(field, value) {
        setUserInfo((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    function getPlaceholder(userType) {
        if (userType === 'admin') return 'Enter Admin password';
        if (userType === 'lecturer') return 'Enter Lecturer registration Id e.g ABCD/1234';
        return 'Enter Student matric number e.g SEN/23/2009';
    }

    async function signInUser(e) {
        e.preventDefault(); 
        try {
            setLoading(true);
            const payload = {...userInfo};
            if (userType === 'admin') await LogInadmin(payload);
            if (userType === 'lecturer') await LogInlecturer(payload);
            if (userType === 'student') {await LogInstudent(payload);}
            setLoading(false);
        } catch (error) {
            console.error("Error during sign-in:", error);
            setLoading(false);
        }
        
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-purple-400">
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="max-w-md w-full shadow-lg rounded-2xl p-6 bg-white">
                <h3 className="text-2xl font-semibold text-center mb-6">
                    Sign In as <span className="capitalize">{userType}</span>
                </h3>
                <form onSubmit={signInUser} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="fullName" className="text-sm font-medium mb-1">
                            {userType === 'student' ? 'School Email' : 'Work Email'}
                        </label>
                        <input
                            required
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={userInfo.email}
                            onChange={(e) => updateUserInfo('email', e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="userId" className="text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            required
                            id="userId"
                            type="text"
                            placeholder={getPlaceholder(userType)}
                            value={userInfo.password}
                            onChange={(e) => updateUserInfo('password', e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <button
                        disabled={loading || !userInfo.email || !userInfo.password }
                        type="submit"
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                            ${loading || !userInfo.email || !userInfo.password ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Sign In
                    </button>
                </form>
                {userType === 'admin' &&
                    <Link to='/newAdmin'>
                    <p className="py-2">CreateAccount</p>
                </Link>}
            </div>
        </div>
    );
}