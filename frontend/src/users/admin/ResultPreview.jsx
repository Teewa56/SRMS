import { previewResult } from '../../api/adminApi';
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import CourseData from "../../coursesInfo.json";
import handleApiError from '../../apiErrorHandler';
import { useState } from 'react';

// Utility to get all departments, levels, and semesters from CourseData
const Faculties = Object.keys(CourseData);
const Departments = Faculties.flatMap(faculty => Object.keys(CourseData[faculty]));
const Levels = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"];
const Semesters = ["First Semester", "Second Semester"];

export default function PreviewResult() {
    const [resultData, setResultData] = useState({
        department: "",
        level: "",
        semester: ""
    });
    const [results, setResults] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get courses for the selected department, level, and semester
    function getCourses(department, level, semester) {
        for (const faculty of Faculties) {
            if (CourseData[faculty][department] &&
                CourseData[faculty][department][level] &&
                CourseData[faculty][department][level][semester]) {
                return CourseData[faculty][department][level][semester];
            }
        }
        return [];
    }

    async function HandleGetResults() {
        if (!navigator.onLine) {
            setError('Internet connection error');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setResults([]);
            const res = await previewResult({
                data: {
                    level: resultData.level,
                    department: resultData.department,
                    semester: resultData.semester
                }
            });
            const fetchedResults = res.data.results || [];
            setResults(fetchedResults);
            const courseList = getCourses(resultData.department, resultData.level, resultData.semester);
            setCourses(courseList);
        } catch (err) {
            handleApiError(err, setError, "An unexpected error occurred");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen p-4">
            <div className='mx-auto max-w-2xl'>
            <h3 className='font-bold text-2xl'>Preview Result</h3>
            <div className="py-2">
                <label><p>Semester</p></label>
                <select
                    className='border-2 rounded-2xl bg-green-400 p-2 border-green-400'
                    value={resultData.semester}
                    onChange={e => setResultData(prev => ({ ...prev, semester: e.target.value }))}
                >
                <option value="">Select Semester</option>
                {Semesters.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="py-2">
                <label><p>Department</p></label>
                <select
                className='border-2 rounded-2xl bg-green-400 p-2 border-green-400'
                value={resultData.department}
                onChange={e => setResultData(prev => ({ ...prev, department: e.target.value }))}
                >
                <option value="">Select Department</option>
                {Departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
            <div className="py-2">
                <label><p>Level</p></label>
                <select
                    className='border-2 rounded-2xl bg-green-400 p-2 border-green-400'
                    value={resultData.level}
                    onChange={e => setResultData(prev => ({ ...prev, level: e.target.value }))}
                >
                <option value="">Select Level</option>
                {Levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
            <button
                onClick={HandleGetResults}
                className="px-4 py-2 border-2 w-fit rounded-3xl hover:cursor-pointer bg-green-400 mt-2 border-green-400"
            >
                <p>Preview Result</p>
            </button>

            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}

            {results.length > 0 && (
                <div className="mt-6 overflow-x-auto w-full">
                <table className="table-auto w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-400 px-4 py-2">Full Name</th>
                            <th className="border border-gray-400 px-4 py-2">Matric No</th>
                            {courses.map((course, index) => (
                                <th key={index} className="border border-gray-400 px-4 py-2">{course}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((student, idx) => (
                            <tr key={idx}>
                            <td className="border border-gray-400 px-4 py-2">{student.fullName}</td>
                            <td className="border border-gray-400 px-4 py-2">{student.matricNumber}</td>
                            {courses.map((course, cidx) => (
                                <td key={cidx} className="border border-gray-400 px-4 py-2">
                                {(() => {
                                    const result = student.results.find(r => r.courseCode === course);
                                    return result
                                        ? `${result.testScore + result.examScore} ${result.grade}`
                                        : "-";
                                    })()}
                                </td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
    );
}