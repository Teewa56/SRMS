import { 
    getAdminProfile, 
    releaseResults,
    updateStudentSemesterLevel,
    registerCoursesForSemester
} from "../../api/adminApi"
import { useEffect, useState, useContext } from "react"
import Toast from "../../components/Toast"
import handleApiError from '../../apiErrorHandler'
import {LogOut} from 'lucide-react'
import {AuthContext} from "../../context/AuthContext"
import {Book, PlusSquare, Check, GitCompareArrows, User2} from 'lucide-react'
import ConfirmBox from "../../components/confirmBox"
import ConfirmUpdate from "../../components/updateConfim"

export function AdminHome() {
    const adminId = localStorage.getItem('userId');
    const [adminProfile, setAdminProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null); 
    const [updateError, setUpdateError] = useState(null); 
    const {Logout} = useContext(AuthContext);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAdminProfile(adminId);
                setAdminProfile(response.data);
            } catch (err) {
                handleApiError(err, setError, "Failed to fetch admin profile");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, [adminId]);

    async function ReleaseResults(){
        setLoading(true);
        setActionError(null);
        try {
            const res = await releaseResults();
            console.log(res);
        } catch (err) {
            handleApiError(err, setActionError, "Failed to release results");
        } finally {
            setLoading(false);
        }
    }

    async function UpdateSemeter(){
        setLoading(true);
        setUpdateError(null);
        try{
            await updateStudentSemesterLevel();
            await registerCoursesForSemester();
        }catch (err) {
            handleApiError(err, setUpdateError, "Failed to update semester");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fuchsia-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Toast text={error} />
            </div>
        );
    }
    
    if (!adminProfile) {
        return null;
    }

    return(
        <div className="h-screen">
            {showConfirm && 
                <ConfirmBox 
                    onConfirm={() => { 
                        setShowConfirm(false); 
                        ReleaseResults(); 
                    }} 
                    onDiscard={() => setShowConfirm(false)} 
                />
            }
            {showUpdateConfirm && 
                <ConfirmUpdate
                    onConfirm={() => {
                        setShowUpdateConfirm(false);
                        UpdateSemeter();
                    }}
                    onDiscard={() => setShowUpdateConfirm(false)}
                />
            }
            {actionError && (
                <Toast text={actionError} />
            )}
            {updateError && (
                <Toast text={updateError} />
            )}
            <div className="max-w-md mx-auto flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center bg-purple-500 rounded-2xl p-4">
                    <div className="flex items-start gap-2 justify-start">
                        <img
                            src={adminProfile?.profilePic || "/images/newUser.svg"}
                            alt="Admin Profile"
                            className="rounded-full w-15 h-15 object-cover"
                        />
                        <div className="flex flex-col text-xs gap-1 font-semibold ">
                            <h3>{adminProfile?.fullName || "Loading..."}</h3>
                            <p>{adminProfile?.workEmail || ""}</p>
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
                <h1 className="font-bold text-2xl">Admin Dashboard</h1>
                <div className="grid grid-cols-2 gap-2">
                    <div 
                        onClick={() => setShowConfirm(true)}
                        className="cursor-pointer flex flex-col gap-2 items-center bg-gray-400 rounded-2xl p-4">
                        <Book className="w-12 h-12 text-fuchsia-500" />
                        <h3>Release Results</h3>
                    </div>
                    <div 
                        onClick={() => window.location.href = '/admin/newStudent'}
                        className="cursor-pointer flex flex-col gap-2 items-center bg-gray-400 rounded-2xl p-4">
                        <PlusSquare className="w-12 h-12 text-fuchsia-500" />
                        <h3>New Student</h3>
                    </div>
                    <div 
                        onClick={() => window.location.href = '/admin/newLecturer'}
                        className="cursor-pointer flex flex-col gap-2 items-center bg-gray-400 rounded-2xl p-4">
                        <PlusSquare className="w-12 h-12 text-fuchsia-500" />
                        <h3>New Lecturer</h3>
                    </div>
                    <div
                        onClick={() => window.location.href = "/admin/resultPreview"} 
                        className="cursor-pointer flex flex-col gap-2 items-center bg-gray-400 rounded-2xl p-4">
                        <Check className="w-12 h-12 text-fuchsia-500" />
                        <h3>Result Preview</h3>
                    </div>
                    <div 
                        onClick={() => setShowUpdateConfirm(true)}
                        className="cursor-pointer flex flex-col gap-2 items-center bg-gray-400 rounded-2xl p-4">
                        <GitCompareArrows className="w-12 h-12 text-fuchsia-500" />
                        <h3>Update Semester</h3>
                    </div>
                    <div
                        onClick={() => window.location.href =  '/admin/profiles'} 
                        className="cursor-pointer flex flex-col gap-2 items-center bg-gray-400 rounded-2xl p-4">
                        <User2 className="w-12 h-12 text-fuchsia-500" />
                        <h3>Profiles</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}