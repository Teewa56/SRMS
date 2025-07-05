import { getLecturerProfile, getCoursesTaking } from '../../api/lecturerApi';
import { useState, useEffect, useContext } from 'react';
import handleApiError from '../../apiErrorHandler';
import Toast from '../../components/Toast';
import { LogOut } from 'lucide-react'
import { AuthContext } from "../../context/AuthContext"

export default function LecturerHome(){
    const lecturerId = localStorage.getItem('userId');
    const [lecturerProfile, setLecturerProfile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLecturerProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getLecturerProfile(lecturerId);
                setLecturerProfile(response.data);
                const courseResponse = await getCoursesTaking(lecturerId);
                setCourses(courseResponse.data.courses || []);
            } catch (err) {
                handleApiError(err, setError, "Failed to fetch lecturer profile");
            } finally {
                setLoading(false);
            }
        };
        fetchLecturerProfile();
    }, [lecturerId]);

    const { Logout } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-purple-400">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-purple-300">
                <Toast text={error} />
            </div>
        );
    }

    if (!lecturerProfile) {
        return null;
    }

    return (
        <div className="bg-purple-400 h-screen">
            <div className="max-w-md mx-auto flex flex-col gap-2 p-4">
                <div className="flex justify-between items-center bg-purple-600 rounded-2xl p-4">
                    <div className="flex items-start gap-2 justify-start">
                        <img
                            src={lecturerProfile?.profilePic || "/images/newUser.svg"}
                            alt="Lecturer Profile"
                            className="rounded-full w-15 h-15 object-cover"
                        />
                        <div className="flex flex-col text-xs gap-1 font-semibold ">
                            <h3>{lecturerProfile?.fullName || "Loading..."}</h3>
                            <p>{lecturerProfile?.workEmail || ""}</p>
                        </div>
                    </div>
                    <LogOut
                        className="cursor-pointer hover:text-gray-700 transition"
                        onClick={() => {
                            Logout();
                            window.location.href = '/';
                        }}
                    />
                </div>
                <h1 className="font-bold text-2xl">Lecturer Dashboard</h1>
                <p className="font-semibold mt-4">Your Courses</p>
                {courses.length === 0 ? (
                    <div className="text-blue-700">No courses assigned.</div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {courses.map((course, idx) => (
                            <div key={idx} 
                                onClick={() => window.location.href = `/lecturer/uploadResult?courseCode=${course}`}
                                className="cursor-pointer flex flex-col gap-2 items-center bg-gray-400 rounded-2xl p-4">
                                {course}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}