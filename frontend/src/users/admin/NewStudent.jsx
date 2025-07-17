import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createStudent } from "../../api/adminApi";
import Toast from '../../components/Toast';
import Loading from "../../components/Loaidng";
import departments from "../../departments.json";
import { Plus } from "lucide-react";
import handleApiError from '../../apiErrorHandler'

const NewStudent = () => {
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        matricNumber: '',
        schoolEmail: '',
        department: '',
        profilePic: '',
        phone: '',
        currentSession: '',
        faculty: '',    
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    function updateUserInfo(field, value) {
        setUserInfo(prev => ({
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

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            let profilePicUrl = userInfo.profilePic;
            if (preview && preview.startsWith('data:')) {
                const res = await fetch(preview);
                const blob = await res.blob();
                profilePicUrl = await uploadToCloudinary(blob);
            }
            const payload = { ...userInfo, profilePic: profilePicUrl };
            await createStudent(payload);
            setLoading(false);
            navigate('/admin');
        } catch (err) {
            handleApiError(err, setError ,"Failed to create student. Please try again.");
            setLoading(false);
        }
    }
    const dept = departments.Departments;

    return (
        <div className="min-h-screen flex items-center justify-center">
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            <div className="max-w-lg w-full bg-opacity-95 shadow-2xl rounded-3xl p-4">
                <h2 className="text-xl font-bold text-center text-green-400 mb-8">Register New Student</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div
                            className="relative w-28 h-28 rounded-full bg-green-400 flex items-center justify-center cursor-pointer border-4 border-green-400 hover:border-green-600 transition"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <Plus className="text-5xl text-white font-bold" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <span className="text-xs text-green-500 mt-2">Upload Profile Picture</span>
                    </div>
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={userInfo.fullName}
                            onChange={e => updateUserInfo('fullName', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-gray-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Matric Number"
                            value={userInfo.matricNumber}
                            onChange={e => updateUserInfo('matricNumber', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-gray-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            required
                        />
                        <input
                            type="email"
                            placeholder="School Email"
                            value={userInfo.schoolEmail}
                            onChange={e => updateUserInfo('schoolEmail', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-gray-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            required
                        />
                        <select
                            value={userInfo.department}
                            onChange={e => updateUserInfo('department', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-gray-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            required
                        >
                            <option value="">Select Department</option>
                            {dept.map((d, idx) => (
                                <option key={idx} value={d}>{d}</option>
                            ))}
                        </select>
                        <select 
                            value={userInfo.faculty} 
                            onChange={e => updateUserInfo('faculty', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-gray-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            required>
                            <option value="">Select Faculty</option>
                            <option value="School of Computing">SOC</option>
                            <option value="School of Engineering">SEET</option>
                            <option value="School of Medicine">SBMS</option>
                            </select>
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={userInfo.phone}
                            onChange={e => updateUserInfo('phone', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-gray-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                        <input
                            type="text"
                            placeholder="Current Session e.g 2023/2024"
                            value={userInfo.currentSession}
                            onChange={e => updateUserInfo('currentSession', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-gray-300 border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 py-2 rounded-lg bg-green-400 text-white font-semibold text-lg hover:bg-green-500 transition"
                    >
                        Register Student
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewStudent;