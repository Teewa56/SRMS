import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createLecturer } from "../../api/adminApi";
import coursesData from "../../coursesInfo.json";
import { Plus } from "lucide-react";
import Toast from '../../components/Toast'
import handleApiError from '../../apiErrorHandler'

export default function NewLecturer() {
    const [lecturerInfo, setLecturerInfo] = useState({
        fullName: "",
        faculty: "",
        workEmail: "",
        workId: "",
        department: "",
        profilePic: "",
        phone: "",
        coursesTaking: []
    });
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Get all faculties from coursesData
    const faculties = Object.keys(coursesData);

    // Get all departments for the selected faculty
    const departments = lecturerInfo.faculty
        ? Object.keys(coursesData[lecturerInfo.faculty])
        : [];

    // Get all courses for the selected department (all levels and semesters)
    const getCoursesForDepartment = (faculty, dept) => {
        if (!faculty || !dept) return [];
        const deptObj = coursesData[faculty][dept];
        let allCourses = [];
        Object.values(deptObj).forEach(levelObj => {
            Object.values(levelObj).forEach(semArr => {
                allCourses = allCourses.concat(semArr);
            });
        });
        // Remove duplicates
        return [...new Set(allCourses)];
    };

    const availableCourses = getCoursesForDepartment(lecturerInfo.faculty, lecturerInfo.department);

    function updateLecturerInfo(field, value) {
        setLecturerInfo(prev => ({
            ...prev,
            [field]: value,
            // Reset department and courses if faculty changes
            ...(field === "faculty" ? { department: "", coursesTaking: [] } : {})
        }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                updateLecturerInfo('profilePic', reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleCourseToggle(course) {
        setLecturerInfo(prev => ({
            ...prev,
            coursesTaking: prev.coursesTaking.includes(course)
                ? prev.coursesTaking.filter(c => c !== course)
                : [...prev.coursesTaking, course]
        }));
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
            let profilePicUrl = lecturerInfo.profilePic;
            if (preview && preview.startsWith('data:')) {
                const res = await fetch(preview);
                const blob = await res.blob();
                profilePicUrl = await uploadToCloudinary(blob);
            }
            const payload = { ...lecturerInfo, profilePic: profilePicUrl };
            await createLecturer(payload);
            setLoading(false);
            navigate('/admin');
        } catch (err) {
            handleApiError(err, setError, "Failed to create lecturer account")
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            {error && <Toast text={error} /> }
            <div className="max-w-md w-full shadow-2xl rounded-3xl p-4">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Register New Lecturer</h2>
                {loading && <div className="text-center font-bold text-blue-600 mb-2">Loading...</div>}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div
                            className="relative w-28 h-28 rounded-full bg-purple-200 flex items-center justify-center cursor-pointer border-4 border-blue-400 hover:border-blue-600 transition"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <Plus className="text-5xl text-blue-400 font-bold" />
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
                    <div className="flex flex-col space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={lecturerInfo.fullName}
                            onChange={e => updateLecturerInfo('fullName', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-purple-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Work Email"
                            value={lecturerInfo.workEmail}
                            onChange={e => updateLecturerInfo('workEmail', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-purple-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Work ID"
                            value={lecturerInfo.workId}
                            onChange={e => updateLecturerInfo('workId', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-purple-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={lecturerInfo.phone}
                            onChange={e => updateLecturerInfo('phone', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-purple-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        <select
                            value={lecturerInfo.faculty}
                            onChange={e => updateLecturerInfo('faculty', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-purple-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                        >
                            <option value="">Select Faculty</option>
                            {faculties.map((faculty, idx) => (
                                <option key={idx} value={faculty}>{faculty}</option>
                            ))}
                        </select>
                        <select
                            value={lecturerInfo.department}
                            onChange={e => updateLecturerInfo('department', e.target.value)}
                            className="rounded-lg px-4 py-2 bg-purple-100 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                            disabled={!lecturerInfo.faculty}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept, idx) => (
                                <option key={idx} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    {/* Courses Taking */}
                    {lecturerInfo.department && (
                        <div className="mt-6">
                            <label className="block text-blue-700 font-semibold mb-2">Select Courses to Assign:</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-purple-50 p-3 rounded-lg border border-blue-200">
                                {availableCourses.map((course, idx) => (
                                    <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={lecturerInfo.coursesTaking.includes(course)}
                                            onChange={() => handleCourseToggle(course)}
                                            className="accent-blue-500"
                                        />
                                        <span className="text-blue-700">{course}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full mt-6 py-2 rounded-lg bg-purple-500 text-white font-semibold text-lg hover:bg-purple-600 transition"
                        disabled={loading}
                    >
                        Register Lecturer
                    </button>
                </form>
            </div>
        </div>
    );
}