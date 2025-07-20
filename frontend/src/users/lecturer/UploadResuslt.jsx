import { useState, useEffect } from 'react'
import {
    getCourseStudents,
    uploadCourseResult,
    getCourseResult
} from '../../api/lecturerApi'
import { useSearchParams, Link} from 'react-router-dom'
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng'
import handleApiError from '../../apiErrorHandler'
import { EclipseIcon } from 'lucide-react'

function calculateGrade(total) {
    if (total >= 70) return 'A';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    if (total >= 45) return 'D';
    if (total >= 40) return 'E';
    return 'F';
}

function ConfirmResultUpload({ onConfirm, onDiscard }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 z-50 p-4">
            <div className="bg-green-400 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4 min-w-[200px]">
                <p className="text-lg font-semibold text-white mb-4">
                    Do you want to Upload this result?
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onDiscard}
                        className="px-6 py-2 rounded-lg bg-gray-300 text-green-500 font-semibold hover:bg-gray-400 transition"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UploadResult() {
    const [searchParams] = useSearchParams();
    const courseCode = searchParams.get('courseCode');
    const lecturerId = localStorage.getItem('userId');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [results, setResults] = useState([]);
    const [scores, setScores] = useState({});
    const [showConfirm, setShowConfirm] = useState(false);
    
    useEffect(() => {
        async function fetchStudents() {
            setLoading(true);
            setError(null);
            try {
                const res = await getCourseStudents(courseCode);
                setStudents(res.data.students || []);
                const courseResultRes = await getCourseResult(lecturerId, courseCode);
                setResults(courseResultRes.data.results || []);
            } catch (err) {
                handleApiError(err, setError, "Failed to fetch students or results");
            } finally {
                setLoading(false);
            }
        }
        if (courseCode && lecturerId) fetchStudents();
    }, [courseCode, lecturerId]);

   function handleInputChange(studentId, field, value) {
        setScores(prev => {
            const prevStudent = prev[studentId] || {};
            const updated = {
                ...prevStudent,
                [field]: value
            };
            const testScore = field === "testScore" ? Number(value) : Number(updated.testScore) || 0;
            const examScore = field === "examScore" ? Number(value) : Number(updated.examScore) || 0;
            const total = testScore + examScore;
            updated.grade = calculateGrade(total);
            return {
                ...prev,
                [studentId]: updated
            };
        });
    }

    async function handleSubmit() {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const resultsToUpload = students.map(student => ({
                studentId: student._id,
                courseCode: courseCode,
                testScore: Number(scores[student._id]?.testScore) || 0,
                examScore: Number(scores[student._id]?.examScore) || 0,
                grade: scores[student._id]?.grade || 'F',
            }));
            await uploadCourseResult(lecturerId, { results: resultsToUpload });
            setSuccess("Results uploaded successfully!");
            window.location.href = "/lecturer"
        } catch (err) {
            handleApiError(err, setError, "Failed to upload results");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    }

    if(loading) return <Loading />

    return (
        <div className="h-screen">
            <div className="max-w-2xl mx-auto flex flex-col gap-4 p-4">
                <h2 className="text-xl font-bold text-green-500 mb-2">Upload Results for {courseCode}</h2>
                {loading && <Loading />}
                {error && <Toast text={error} color="red" />}
                {success && <Toast text={success} color="green" />}
                {showConfirm && (
                    <ConfirmResultUpload
                        onConfirm={handleSubmit}
                        onDiscard={() => setShowConfirm(false)}
                    />
                )}
                {students.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center mt-10">
                        <EclipseIcon className="w-16 h-16 text-green-500 mb-2" />
                        <p className="text-green-600">No students found for this course.</p>
                    </div>
                ) : (
                    <form onSubmit={e => { e.preventDefault(); setShowConfirm(true); }}>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full border-collapse border border-green-400 bg-white">
                                <thead>
                                    <tr className="bg-green-200">
                                        <th className="border border-green-400 px-2 py-1">Full Name</th>
                                        <th className="border border-green-400 px-2 py-1">Matric No</th>
                                        <th className="border border-green-400 px-2 py-1">Test Score(40)</th>
                                        <th className="border border-green-400 px-2 py-1">Exam Score(60)</th>
                                        <th className="border border-green-400 px-2 py-1">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student._id}>
                                            <td className="border border-purple-400 px-2 py-1">{student.fullName}</td>
                                            <td className="border border-purple-400 px-2 py-1">{student.matricNumber}</td>
                                            <td className="border border-purple-400 px-2 py-1">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={40}
                                                    value={scores[student._id]?.testScore || ""}
                                                    onChange={e => handleInputChange(student._id, "testScore", e.target.value)}
                                                    className="w-16 p-1 rounded border border-purple-300"
                                                    required
                                                />
                                            </td>
                                            <td className="border border-purple-400 px-2 py-1">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={60}
                                                    value={scores[student._id]?.examScore || ""}
                                                    onChange={e => handleInputChange(student._id, "examScore", e.target.value)}
                                                    className="w-16 p-1 rounded border border-purple-300"
                                                    required
                                                />
                                            </td>
                                            <td className="border border-purple-400 px-2 py-1">
                                                <input
                                                    type="text"
                                                    maxLength={2}
                                                    value={scores[student._id]?.grade || ""}
                                                    readOnly
                                                    className="w-12 p-1 rounded border border-purple-300 bg-gray-100"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-4 mt-4">
                            {results[0]?.isUploaded ? (
                                <Link
                                    to={`/lecturer/editResult/${courseCode}`}
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                                    disabled={loading}
                                >
                                    Edit Results
                                </Link>
                            ) : (
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                                    disabled={loading}
                                >
                                    Upload Results
                                </button>
                            )}
                        </div>
                    </form>
                )}
                {results.length > 0 && results[0]?.isUploaded && (
                <>
                    <div className="mb-4 bg-green-100 rounded-xl p-4 overflow-x-auto print-section">
                        <h3 className="font-bold text-green-800 mb-2">Uploaded Results for {courseCode}</h3>
                        <p>Level: {results[0].student?.currentLevel}</p>
                        <p>Session: {results[0].student?.currentSession}</p>
                        <p>Semester: {results[0].student?.currentSemester}</p>
                        <table className="table-auto w-full border-collapse border border-green-400 bg-white">
                            <thead>
                                <tr className="bg-green-200">
                                    <th className="border border-green-400 px-2 py-1">Full Name</th>
                                    <th className="border border-green-400 px-2 py-1">Matric No</th>
                                    <th className="border border-green-400 px-2 py-1">Test Score</th>
                                    <th className="border border-green-400 px-2 py-1">Exam Score</th>
                                    <th className="border border-green-400 px-2 py-1">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(result => (
                                    <tr key={result._id}>
                                        <td className="border border-green-400 px-2 py-1">{result.student?.fullName}</td>
                                        <td className="border border-green-400 px-2 py-1">{result.student?.matricNumber}</td>
                                        <td className="border border-green-400 px-2 py-1">{result.testScore}</td>
                                        <td className="border border-green-400 px-2 py-1">{result.examScore}</td>
                                        <td className="border border-green-400 px-2 py-1">{result.grade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        onClick={() => {
                            const printContents = document.querySelector('.print-section').innerHTML;
                            const originalContents = document.body.innerHTML;
                            document.body.innerHTML = printContents;
                            window.print();
                            document.body.innerHTML = originalContents;
                            window.location.reload();
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition print:hidden"
                    >
                        Print Results
                    </button>
                </>
                )}
            </div>
        </div>
    );
}