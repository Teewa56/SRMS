import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { editStudent, getAllStudents } from "../../api/adminApi";
import Toast from '../../components/Toast';
import Loading from "../../components/Loaidng";
import departments from "../../departments.json";
import handleApiError from '../../apiErrorHandler';

export default function EditStudent() {
    const [searchParams] = useSearchParams();
    const studentId = searchParams.get('studentId');
    const [studentInfo, setStudentInfo] = useState({
        fullName: '',
        matricNumber: '',
        schoolEmail: '',
        department: '',
        profilePic: '',
        phoneNumber: '',
        currentSession: '',
        faculty: '',    
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const dept = departments.Departments;

    useEffect(() => {
        async function getStudentProfile() {
            try {
                setLoading(true);
                const res = await getAllStudents();
                const student = res.data.find(student => student._id === studentId);
                
                if (student) {
                    setStudentInfo({
                        fullName: student.fullName || '',
                        matricNumber: student.matricNumber || '',
                        schoolEmail: student.schoolEmail || '',
                        department: student.department || '',
                        profilePic: student.profilePic || '',
                        phoneNumber: student.phoneNumber || '',
                        currentSession: student.currentSession || '',
                        faculty: student.faculty || ''
                    });
                    setImagePreview(student.profilePic || '');
                }
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }

        if (studentId) {
            getStudentProfile();
        }
    }, [studentId]);

    function updateStudentInfo(field, value) {
        setStudentInfo(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                updateStudentInfo('profilePic', reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    async function uploadToCloudinary(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", 'pymeet');
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data
            }
        );
        const result = await res.json();
        return result.secure_url;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            let profilePicUrl = studentInfo.profilePic;
            
            // Upload new image if one was selected
            if (imageFile) {
                profilePicUrl = await uploadToCloudinary(imageFile);
            }

            const payload = { 
                ...studentInfo, 
                profilePic: profilePicUrl 
            };
            
            await editStudent(studentId, payload);
            navigate('/admin');
        } catch (err) {
            handleApiError(err, setError, "Failed to edit student. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto p-4">
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            
            <div className="">
                <h2 className="text-2xl font-bold text-center text-green-500 mb-6">Edit Student</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center mb-4">
                        <div
                            className="relative w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-4 border-green-400 hover:border-green-600 transition"
                            onClick={() => fileInputRef.current.click()}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="text-4xl text-green-400 font-bold">+</div>
                            )}
                            <input
                                id="input"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                        <label className="text-sm text-green-500 mt-2 cursor-pointer" htmlFor="input">Click to change profile picture</label>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={studentInfo.fullName}
                                onChange={e => updateStudentInfo('fullName', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
                            <input
                                type="text"
                                placeholder="Matric Number"
                                value={studentInfo.matricNumber}
                                onChange={e => updateStudentInfo('matricNumber', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">School Email</label>
                            <input
                                type="email"
                                placeholder="School Email"
                                value={studentInfo.schoolEmail}
                                onChange={e => updateStudentInfo('schoolEmail', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                                value={studentInfo.department}
                                onChange={e => updateStudentInfo('department', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="">Select Department</option>
                                {dept.map((d, idx) => (
                                    <option key={idx} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                            <select 
                                value={studentInfo.faculty} 
                                onChange={e => updateStudentInfo('faculty', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                required
                            >
                                <option value="">Select Faculty</option>
                                <option value="School of Computing">School of Computing (SOC)</option>
                                <option value="School of Engineering">School of Engineering (SEET)</option>
                                <option value="School of Medicine">School of Medicine (SBMS)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Session</label>
                            <input
                                type="text"
                                placeholder="e.g. 2023/2024"
                                value={studentInfo.currentSession}
                                onChange={e => updateStudentInfo('currentSession', e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold text-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}