import { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import Loading from '../components/Loaidng';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react'

export default function CreateAccount() {

    const userType = localStorage.getItem('userType');
    const [userInfo, setUserInfo] = useState({
        workEmail: '',
        password: '',
        fullName: '',
        phone: '',
        adminId: '',
        profilePic: '',
    });
    const { createAdmin, error, isAuth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                updateUserInfo('profilePic', reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    async function uploadToCloudinary(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", 'pymeet');
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: data
        });
        const result = await res.json();
        return result.secure_url;
    }

    async function createUser(e) {
        e.preventDefault();
        try {
            setLoading(true);
            let profilePicUrl = userInfo.profilePic;
            if (preview && preview.startsWith('data:')) {
                const res = await fetch(preview);
                const blob = await res.blob();
                profilePicUrl = await uploadToCloudinary(blob);
            }
            const payload = { ...userInfo, profilePic: profilePicUrl };
            await createAdmin(payload);
            setLoading(false);
        } catch (error) {
            console.error("Error during account creation:", error);
            setLoading(false);
        }
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-purple-400">
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="max-w-md w-full shadow-lg bg-white rounded-2xl p-6 bg-opacity-90">
                <h3 className="text-2xl font-semibold text-center mb-6">
                    Create Account
                </h3>
                <form onSubmit={createUser} className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                        <div
                            className="relative w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer border-2 border-blue-400 hover:border-blue-600 transition"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <Plus className="text-4xl text-blue-400 font-bold" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <span className="text-xs text-blue-500 mt-2">Upload Profile Picture</span>
                    </div>
                    <div className="flex flex-col space-y-3">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={userInfo.fullName}
                            onChange={e => updateUserInfo('fullName', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-blue-300 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Work Email"
                            value={userInfo.workEmail}
                            onChange={e => updateUserInfo('workEmail', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-blue-300 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={userInfo.password}
                            onChange={e => updateUserInfo('password', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-blue-300 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={userInfo.phone}
                            onChange={e => updateUserInfo('phone', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-blue-300 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        <input
                            type="text"
                            placeholder="Admin ID"
                            value={userInfo.adminId}
                            onChange={e => updateUserInfo('adminId', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-blue-300 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}