import { 
    getStudentProfile,
    getCarryOverCourses,
    getGPA,
} from '../../api/studentApi';
import { useState, useEffect, useContext } from 'react';
import handleApiError from '../../apiErrorHandler';
import Toast from '../../components/Toast';
import { Link, LogOut } from 'lucide-react'
import { AuthContext } from "../../context/AuthContext"

export default function StudentHome(){
    const studentId = localStorage.getItem('userId');
    const [studentProfile, setStudentProfile] = useState(null);
    const [carryOverCourses, setCarryOverCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gpData, setGpData] = useState({
        gpa: 0,
        cpga: 0
    })

    useEffect(() => {
        const fetchStudentProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getStudentProfile(studentId);
                setStudentProfile(response.data);
                const courseResponse = await getCarryOverCourses(studentId);
                setCarryOverCourses(courseResponse.data.courses || []);
                const gpaResponse = await getGPA(studentId);
                setGpData(gpaResponse.data.gpData);
            } catch (err) {
                handleApiError(err, setError, "Failed to fetch lecturer profile");
            } finally {
                setLoading(false);
            }
        };
        fetchStudentProfile();
    }, [studentId]);

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

    if (!studentProfile) {
        return null;
    }

    return (
        <div className="bg-purple-400 h-screen">
            <div className="max-w-md mx-auto flex flex-col gap-2 p-4">
                <div className="flex justify-between items-center bg-purple-600 rounded-2xl p-4">
                    <div className="flex items-start gap-2 justify-start">
                        <img
                            src={studentProfile?.profilePic || "/images/newUser.svg"}
                            alt="Lecturer Profile"
                            className="rounded-full w-15 h-15 object-cover"
                        />
                        <div className="flex flex-col text-xs gap-1 font-semibold ">
                            <h3>{studentProfile?.fullName || "Loading..."}</h3>
                            <p>{studentProfile?.studentEmail || "-"}</p>
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
                <h1 className="font-bold text-2xl">Student Dashboard</h1>
                <div className='grid grid-cols-2 gap-2 font-bold'>
                    <div className='bg-purple-600 rounded-2xl p-4 h-20 hover:scale-150'>
                        <p>{studentProfile?.matricNumber || "-"}</p>
                        <p>Gpa: {gpData.gpa}</p>
                        <p>CGPA: {gpData.cpga}</p>
                    </div>
                    <div className='h-20'>
                        <p>Current Level: {studentProfile.currentLevel}</p>
                        <p>Current Semester: {studentProfile.currentSemester}</p>
                        <p>Current Session: {studentProfile.currentSession}</p>
                    </div>
                    <Link 
                        className='bg-purple-600 rounded-2xl p-4 h-20 hover:scale-150'
                        to='/student/results'>
                        <p>Results</p>
                    </Link>
                </div>
                <p className="font-semibold mt-4">Your Carry Over Courses</p>
                {carryOverCourses.length === 0 ? (
                    <div className="text-blue-700">No carryOverCourses assigned.</div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {carryOverCourses.map((course, idx) => (
                            <div key={idx} 
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