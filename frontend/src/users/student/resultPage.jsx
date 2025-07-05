import { useState, useEffect, useRef, useMemo } from "react";
import { getResult, getGPA, getStudentProfile } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import handleApiError from "../../apiErrorHandler";

export default function Result() {
    const { studentId } = useParams();
    const [searchParams] = useSearchParams();
    const level = searchParams.get("level");
    const semester = searchParams.get("semester");
    const payload = useMemo(() => ({ level, semester }), [level, semester]);
    const [result, setResult] = useState([]);
    const [gpa, setGpa] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cGPA, setCGPA] = useState(null);
    const [student, setStudent] = useState({});
    const navigate = useNavigate();
    const printRef = useRef();
    

    useEffect(() => {
        async function fetchResult() {
            setLoading(true);
            try {
                const res = await getResult(studentId, {data: payload});
                setResult(res.data.semesterResults[0]?.courses || []);
                const gpaRes = await getGPA(studentId);
                const studentRes = await getStudentProfile(studentId);
                setStudent(studentRes.data);
                setGpa(gpaRes.data.gpData.gpa);
                setCGPA(gpaRes.data.gpData.cgpa);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchResult();
    }, [studentId, payload]);

    return (
        <div className="mx-auto max-w-md p-4 bg-purple-400">
            <div className="flex items-center justify-start gap-4 mb-2 print:hidden">
                <img
                    src="/images/back-button.svg"
                    className="md:hidden w-8 h-8 cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-xl font-bold mb-2">Result Details</h2>
            </div>

            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}

            {result.length > 0 && (
                <div className="overflow-x-auto print-area" ref={printRef}>
                    <h2 className="text-xl font-semibold mb-2">{`${payload.level} ${payload.semester} Result`}</h2>
                    <div className="mb-4 space-y-2">
                        <div><span className="font-bold">Full Name:</span> {student.fullName}</div>
                        <div><span className="font-bold">Matric Number:</span> {student.matricNo}</div>
                        <div><span className="font-bold">Semester:</span> {result[0].semester}</div>
                        <div><span className="font-bold">Level:</span> {result[0].level}</div>
                        <div><span className="font-bold">Department:</span> {student.department}</div>
                    </div>

                    <table className="min-w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Course Code</th>
                                <th className="border border-gray-300 p-2 text-left">Test Score</th>
                                <th className="border border-gray-300 p-2 text-left">Exam Score</th>
                                <th className="border border-gray-300 p-2 text-left">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {result.map((item) => (
                                <tr key={item.courseCode}>
                                    <td className="border border-gray-300 p-2">{item.courseCode}</td>
                                    <td className="border border-gray-300 p-2">{item.testScore}</td>
                                    <td className="border border-gray-300 p-2">{item.examScore}</td>
                                    <td className="border border-gray-300 p-2">{item.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {gpa !== null && (
                <div className="mt-4 p-4 border rounded-xl flex items-center justify-between text-sm">
                    <strong>GPA: {gpa.toFixed(2)}</strong>
                    <strong>CGPA: {cGPA}</strong>
                </div>
            )}

            {result.length > 0 &&  
            <div className="mt-4 print:hidden">
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
                    onClick={() => window.print()}
                >
                    Print Result
                </button>
            </div>}
        </div>
    );
}
