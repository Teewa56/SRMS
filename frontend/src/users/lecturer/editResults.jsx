import { useState, useEffect } from "react"
import Toast from '../../components/Toast'
import Loading from '../../components/Loaidng' 
import { editResult, getCourseStudents, getCourseResult } from "../../api/lecturerApi"
import { useParams, useNavigate } from "react-router-dom"
import handleApiError from "../../apiErrorHandler"

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
            <div className="bg-green-500 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4 min-w-[200px]">
                <p className="text-lg font-semibold text-green-700 mb-4">
                    Do you want to Edit this result?
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg bg-green-400 text-white font-semibold hover:bg-green-600 transition"
                    >
                        Yes
                    </button>
                    <button
                        onClick={onDiscard}
                        className="px-6 py-2 rounded-lg bg-gray-300 text-green-500 font-semibold hover:bg-red-400 transition"
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function EditResult(){
    const { CourseCode: courseId } = useParams(); 
    const lecturerId = localStorage.getItem('userId');
    const [students, setStudents] = useState([]);
    const [scores, setScores] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const studentsRes = await getCourseStudents(courseId);
                setStudents(studentsRes.data.students || []);
                const resultsRes = await getCourseResult(lecturerId, courseId);
                const initialScores = {};
                studentsRes.data.students.forEach(stu => {
                    const result = resultsRes.data.results.find(r => r.student._id === stu._id);
                    initialScores[stu._id] = {
                        test: result ? result.testScore : '',
                        exam: result ? result.examScore : '',
                        grade: result ? result.grade : ''
                    };
                });
                setScores(initialScores);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred")
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [courseId, lecturerId]);

    function handleScoreChange(studentId, field, value) {
        setScores(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            for (const student of students) {
                const studentId = student._id;
                const testScore = Number(scores[studentId]?.test) || 0;
                const examScore = Number(scores[studentId]?.exam) || 0;
                const total = testScore + examScore;
                const grade = calculateGrade(total);

                await editResult(lecturerId, {
                    data: {
                        courseCode: courseId,
                        studentId: studentId,
                        testScore: testScore,
                        examScore: examScore,
                        grade: grade
                    }
                });
            }

            setSuccess("All results saved successfully");
            setTimeout(() => navigate('/lecturer'), 2000);
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occurred")
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    }

    return(
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-start gap-4 mb-4">
                <img src="/images/back-button.svg" className="md:hidden w-8 h-8" 
                    onClick={() => navigate(-1)} alt="Back"/>
                <h3 className="text-xl font-bold">Edit {courseId} Results</h3>
            </div>
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            {success && <Toast text={success} color="green" />}
            {showConfirm && (
                <ConfirmResultUpload
                    onConfirm={handleSubmit}
                    onDiscard={() => setShowConfirm(false)}
                />
            )}
            <form onSubmit={e => { e.preventDefault(); setShowConfirm(true); }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border px-2 py-1">S/N</th>
                                <th className="border px-2 py-1">Student Name</th>
                                <th className="border px-2 py-1">Matric No</th>
                                <th className="border px-2 py-1">Test Score</th>
                                <th className="border px-2 py-1">Exam Score</th>
                                <th className="border px-2 py-1">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((stu, idx) => {
                                const testScore = Number(scores[stu._id]?.test) || 0;
                                const examScore = Number(scores[stu._id]?.exam) || 0;
                                const totalScore = testScore + examScore;
                                
                                return (
                                    <tr key={stu._id}>
                                        <td className="border px-2 py-1">{idx + 1}</td>
                                        <td className="border px-2 py-1">{stu.fullName}</td>
                                        <td className="border px-2 py-1">{stu.matricNumber}</td>
                                        <td className="border px-2 py-1">
                                            <input
                                                type="number"
                                                min="0"
                                                max="40"
                                                value={scores[stu._id]?.test || ''}
                                                onChange={e => handleScoreChange(stu._id, 'test', e.target.value)}
                                                className="w-16 p-1 border rounded"
                                                required
                                            />
                                        </td>
                                        <td className="border px-2 py-1">
                                            <input
                                                type="number"
                                                min="0"
                                                max="60"
                                                value={scores[stu._id]?.exam || ''}
                                                onChange={e => handleScoreChange(stu._id, 'exam', e.target.value)}
                                                className="w-16 p-1 border rounded"
                                                required
                                            />
                                        </td>
                                        <td className="border px-2 py-1 text-center">
                                            {calculateGrade(totalScore)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {students.length === 0 && (
                    <div className="my-5">
                        <img src="/images/error.svg" alt="Error" className="w-10 h-10 mx-auto m-2"/>
                        <p className="text-center">No Students and Information Found for this course</p>
                    </div>
                )}
                <button
                    type="submit"
                    className={`mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${students.length === 0 && 'cursor-not-allowed opacity-50'}`}
                    disabled={loading || students.length === 0}
                >
                    {loading ? 'Loading...' : 'Save Changes'}
                </button>
            </form>
        </div>
    )
}