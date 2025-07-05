import { getAllAdmins, getAllStudents, getAllLecturers } from "../../api/adminApi";
import { useEffect, useState } from "react";
import Loading from '../../components/Loaidng';

const tabs = [
    { key: "admins", label: "Admins" },
    { key: "students", label: "Students" },
    { key: "lecturers", label: "Lecturers" }
];

export default function ProfileListPage() {
    const [activeTab, setActiveTab] = useState(sessionStorage.getItem('tab') || 'admins');
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState([]);

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

    return (
        <div className="max-w-md mx-auto p-4 bg-purple-400 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">Profiles</h3>
            <nav className="flex border-b border-purple-300 mb-6">
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
                            <span className="absolute left-0 right-0 -bottom-1 h-1 bg-purple-500 rounded transition-all duration-300"></span>
                        )}
                    </button>
                ))}
            </nav>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    {profiles.length === 0 ? (
                        <div className="text-center text-purple-300 py-10">No {activeTab} found.</div>
                    ) : (
                        <ul className="divide-y divide-purple-100">
                            {profiles.map((profile, idx) => (
                                <li key={profile._id || idx} className="py-4 flex items-center space-x-4">
                                    {profile.profilePic && (
                                        <img
                                            src={profile.profilePic}
                                            alt="profile"
                                            className="w-12 h-12 rounded-full object-cover border border-blue-200"
                                        />
                                    )}
                                    <div>
                                        <div className="font-semibold text-black-700">{profile.fullName}</div>
                                        <div className="text-sm text-black-400">{profile.workEmail || profile.schoolEmail || profile.email}</div>
                                        {activeTab === "students" && (
                                            <div className="text-xs text-black">
                                                <p>Matric No: {profile.matricNumber}</p>
                                                <p>{profile.currentLevel}</p>
                                            </div>
                                        )}
                                        {activeTab === "lecturers" && (
                                            <div className="text-xs text-black">Dept: {profile.department}</div>
                                        )}
                                        <div className="text-sm text-black">
                                            <p>{profile.phone}</p>
                                            <p>{profile.adminId}</p>
                                        </div>
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