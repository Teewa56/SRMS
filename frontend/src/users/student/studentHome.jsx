import { 
    getStudentProfile,
    getCarryOverCourses,
    getGPA,
} from '../../api/studentApi';
import { useState, useEffect, useContext } from 'react';
import handleApiError from '../../apiErrorHandler';
import Toast from '../../components/Toast';
import { LogOut } from 'lucide-react'
import { AuthContext } from "../../context/AuthContext"
import { Link } from 'react-router-dom';

export default function StudentHome(){
    const studentId = localStorage.getItem('userId');
    const [studentProfile, setStudentProfile] = useState(null);
    const [carryOverCourses, setCarryOverCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gpData, setGpData] = useState({
        gpa: 0,
        cgpa: 0
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
        <div className="h-screen">
            <div className="max-w-md mx-auto flex flex-col gap-2 p-4">
                <div className="flex justify-between items-center bg-purple-600 rounded-2xl p-4">
                    <div className="flex items-start gap-2 justify-start">
                        <img
                            src={studentProfile?.profilePic || "/images/newUser.svg"}
                            alt="Lecturer Profile"
                            className="rounded-full w-15 h-15 object-cover"
                        />
                        <div className="flex flex-col gap-1 font-semibold ">
                            <h3>{studentProfile?.fullName || "Loading..."}</h3>
                            <p>{studentProfile?.schoolEmail || "-"}</p>
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
                    <div className='bg-purple-600 rounded-2xl p-4 hover:scale-105 transition-all duration-300'>
                        <p>{studentProfile.matricNumber}</p>
                        <p>GPA: {gpData.gpa.toFixed(2)}</p>
                        <p>CGPA: {gpData.cgpa}</p>
                    </div>
                    <div className='bg-purple-600 rounded-2xl p-4 hover:scale-105 transition-all duration-300'>
                        <p>{studentProfile.currentLevel}</p>
                        <p>{studentProfile.currentSemester}</p>
                        <p>{studentProfile.currentSession}</p>
                    </div>
                    <Link 
                        className='bg-purple-600 hover:scale-105 transition-all duration-300 rounded-2xl p-4 h-20 text-2xl flex items-center justify-between'
                        to='/student/results'>
                            <p>Results</p>
                            <p>→</p>
                    </Link>
                </div>
                
                <p className="font-semibold mt-4">Your Registered Courses</p>
                <div className="grid grid-cols-2 gap-2">
                    {studentProfile.registeredCourses.map((course, idx) => (
                        <div key={idx} 
                            className="cursor-pointer flex flex-col gap-2 items-center bg-gray-200 rounded-2xl p-4">
                            {course}
                        </div>
                    ))}
                </div>
                <p className="font-semibold mt-4">Your Carry Over Courses</p>
                {carryOverCourses.length === 0 ? (
                    <div className="text-blue-700">No carryOver Courses.</div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {carryOverCourses.map((course, idx) => (
                            <div key={idx} 
                                className="cursor-pointer flex flex-col gap-2 items-center bg-gray-200 rounded-2xl p-4">
                                {course}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}