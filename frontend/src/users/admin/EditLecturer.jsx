import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { editLecturer, getAllLecturers } from "../../api/adminApi";
import coursesData from "../../coursesInfo.json";
import departments from "../../departments.json";
import Toast from '../../components/Toast';
import handleApiError from '../../apiErrorHandler';
import Loading from '../../components/Loaidng';

export default function EditLecturer() {
    const [searchParams] = useSearchParams();
    const lecturerId = searchParams.get('lecturerId');
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
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [faculties] = useState(Object.keys(coursesData));
    const [departmentsList] = useState(departments.Departments);

    useEffect(() => {
        async function fetchLecturerData() {
            try {
                setLoading(true);
                const response = await getAllLecturers();
                const lecturer = response.data.find(lect => lect._id === lecturerId);
                
                if (lecturer) {
                    setLecturerInfo({
                        fullName: lecturer.fullName || "",
                        faculty: lecturer.faculty || "",
                        workEmail: lecturer.workEmail || "",
                        workId: lecturer.workId || "",
                        department: lecturer.department || "",
                        profilePic: lecturer.profilePic || "",
                        phone: lecturer.phone || "",
                        coursesTaking: lecturer.coursesTaking || []
                    });
                    setImagePreview(lecturer.profilePic || '');
                }
            } catch (err) {
                handleApiError(err, setError, "Failed to load lecturer data");
            } finally {
                setLoading(false);
            }
        }

        if (lecturerId) {
            fetchLecturerData();
        }
    }, [lecturerId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLecturerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'pymeet');
        formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleCourseToggle = (courseCode) => {
        setLecturerInfo(prev => {
            const isSelected = prev.coursesTaking.includes(courseCode);
            return {
                ...prev,
                coursesTaking: isSelected
                    ? prev.coursesTaking.filter(code => code !== courseCode)
                    : [...prev.coursesTaking, courseCode]
            };
        });
    };

    const getCoursesForFaculty = () => {
        if (!lecturerInfo.faculty) return [];
        
        const facultyData = coursesData[lecturerInfo.faculty];
        if (!facultyData) return [];
        
        // Flatten all courses from all departments and levels
        const allCourses = [];
        for (const dept of Object.values(facultyData)) {
            for (const level of Object.values(dept)) {
                for (const semester of Object.values(level)) {
                    allCourses.push(...semester);
                }
            }
        }
        
        // Remove duplicates and sort
        return [...new Set(allCourses)].sort();
    };

    const filteredCourses = getCoursesForFaculty().filter(course => 
        course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let profilePicUrl = lecturerInfo.profilePic;
            
            if (imageFile) {
                profilePicUrl = await uploadImage(imageFile);
            }

            const payload = {
                ...lecturerInfo,
                profilePic: profilePicUrl
            };
            await editLecturer(lecturerId, payload);
            navigate('/admin');
        } catch (err) {
            handleApiError(err, setError, "Failed to update lecturer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {error && <Toast text={error} color="red" />}
            {loading && <Loading />}

            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold">Edit Lecturer</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={lecturerInfo.fullName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Work Email</label>
                        <input
                            type="email"
                            name="workEmail"
                            value={lecturerInfo.workEmail}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Work ID</label>
                        <input
                            type="text"
                            name="workId"
                            value={lecturerInfo.workId}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={lecturerInfo.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Faculty</label>
                        <select
                            name="faculty"
                            value={lecturerInfo.faculty}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="">Select Faculty</option>
                            {faculties.map(faculty => (
                                <option key={faculty} value={faculty}>{faculty}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            name="department"
                            value={lecturerInfo.department}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="">Select Department</option>
                            {departmentsList.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <img 
                                    src={imagePreview} 
                                    alt="Profile preview" 
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-green-700
                                hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Assigned Courses</h3>
                    
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-md"
                        />
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                        <p className="text-sm text-gray-500 mb-2">
                            Selected: {lecturerInfo.coursesTaking.length} courses
                        </p>

                        {filteredCourses.length > 0 ? (
                            <div className="space-y-2">
                                {filteredCourses.map(course => (
                                    <div key={course} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`course-${course}`}
                                            checked={lecturerInfo.coursesTaking.includes(course)}
                                            onChange={() => handleCourseToggle(course)}
                                            className="h-4 w-4 text-green-600 rounded"
                                        />
                                        <label htmlFor={`course-${course}`} className="ml-2 text-sm">
                                            {course}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-4">No courses found</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}