import { getAllAdmins, getAllStudents, deleteAdmin, getAllLecturers, deleteLecturer, deleteStudent } from "../../api/adminApi";
import { useEffect, useState } from "react";
import Loading from '../../components/Loaidng';
import handleApiError from "../../apiErrorHandler";
import Toast from '../../components/Toast'
import {User, Trash, Edit3Icon} from 'lucide-react'

const tabs = [
    { key: "admins", label: "Admins" },
    { key: "students", label: "Students" },
    { key: "lecturers", label: "Lecturers" }
];

export default function ProfileListPage() {
    const [activeTab, setActiveTab] = useState(sessionStorage.getItem('tab') || 'admins');
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        async function fetchProfiles() {
            setLoading(true);
            if (activeTab === "admins") {
                const res = await getAllAdmins();
                setProfiles(res.data || []);
            } else if (activeTab === "students") {
                const res = await getAllStudents();
                setProfiles(res.data || []);
            } else if (activeTab === "lecturers") {
                const res = await getAllLecturers();
                setProfiles(res.data || []);
            }
            setLoading(false);
        }
        fetchProfiles();
    }, [activeTab]);

    function handleTabChange(tab) {
        setActiveTab(tab);
        sessionStorage.setItem('tab', tab);
    }

    async function handleDelete(userId){
        try {
            if(!userId) return;
            if(activeTab === "students"){
                await deleteStudent(userId);
            }else if(activeTab === "lecturers"){
                await deleteLecturer(userId);
            }else{
                await deleteAdmin(userId);
            }
            window.location.reload();
        } catch (error) {
            handleApiError(error, setErrorMessage, "An error occured while deleting user")
        }
    }

    return (
        <div className="max-w-md mx-auto p-4 rounded-xl">
            {errorMessage && <Toast text={errorMessage} />}
            <h3 className="text-2xl font-bold mb-6">Profiles</h3>
            <nav className="flex border-b border-green-300 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`flex-1 py-2 text-lg font-semibold transition relative
                            ${activeTab === tab.key ? "text-black" : "text-black"}
                        `}
                        style={{ outline: "none" }}
                    >
                        {tab.label}
                        {activeTab === tab.key && (
                            <span className="absolute left-0 right-0 -bottom-1 h-1 bg-green-500 rounded transition-all duration-300"></span>
                        )}
                    </button>
                ))}
            </nav>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    {profiles.length === 0 ? (
                        <div className="text-center text-green-300 py-10">No {activeTab} found.</div>
                    ) : (
                        <ul className="divide-y divide-green-100">
                            {profiles.map((profile, idx) => (
                                <li key={profile._id || idx} className="flex items-center justify-between">
                                    <div className="flex items-start justify-start gap-2 w-2/3">
                                        {profile.profilePic ? (
                                            <img
                                                src={profile.profilePic}
                                                alt="profile"
                                                className="w-1/4 h-15 rounded-xl object-cover border border-green-200"
                                            />
                                        ) : (
                                            <User size={40} />
                                        )}
                                        <div className="w-3/4">
                                            <div className="font-semibold text-black-700">{profile.fullName}</div>
                                            <div className="text-sm text-black-400">{profile.workEmail || profile.schoolEmail || profile.email}</div>
                                            {activeTab === "students" && (
                                                <div className="text-xs text-black">
                                                    <p>Matric No: {profile.matricNumber}</p>
                                                </div>
                                            )}
                                            {activeTab === "lecturers" && (
                                                <div className="text-xs text-black">Dept: {profile.department}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-1/3 flex items-center justify-end">
                                    {userId !== profile._id &&
                                    <button 
                                        onClick={() => handleDelete(profile._id)}
                                        className="text-xs p-2 rounded-xl bg-red-400 text-white cursor-pointer">
                                        <Trash size={20} />
                                    </button>}
                                    <button
                                        onClick={() => {
                                            if(activeTab === 'admins'){
                                                window.location.href = `/admin/editAdmin?adminId=${profile._id}`
                                            }else if(activeTab === 'lecturers'){
                                                window.location.href = `/admin/editLecturer?lecturerId=${profile._id}`
                                            }else{
                                                window.location.href = `/admin/editStudent?studentId=${profile._id}`
                                            }
                                        }}
                                        className="text-xs ml-2 p-2 rounded-xl cursor-pointer bg-green-400 text-white">
                                        <Edit3Icon size={20} />
                                    </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}