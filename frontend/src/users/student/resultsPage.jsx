import { useState, useEffect } from "react";
import { getAllResults } from "../../api/studentApi";
import Loading from '../../components/Loaidng';
import Toast from '../../components/Toast';
import { Link } from "react-router-dom";
import handleApiError from "../../apiErrorHandler";

export default function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const studentId = localStorage.getItem('userId');
    
    useEffect(() => {
        async function fetchResults() {
            setLoading(true);
            try {
                const res = await getAllResults(studentId);
                setResults(res.data.semesterResults || []);
            } catch (err) {
                handleApiError(err, setError, "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchResults();
    }, [studentId]);
    
    return (
        <div className="max-w-md mx-auto bg-purple-400 p-4">
            <div className="flex items-center justify-start gap-4 mb-2">
                <img 
                    src="/images/back-button.svg" 
                    className="md:hidden w-8 h-8 cursor-pointer" 
                    onClick={() => window.history.back()}
                    alt="Back"
                />
                <h2 className="text-2xl font-bold">All Results</h2>
            </div>
            
            {loading && <Loading />}
            {error && <Toast text={error} color="red" />}
            
            <div className="space-y-4">
                {results.length === 0 && !loading && 
                    <div className="p-4 text-center text-gray-500">No results yet!</div>
                }

                {results.map((result, index) => {
                    const firstCourse = result.courses?.[0];
                    if (!firstCourse) return null;

                    return (
                        <Link
                            key={`${result.semester}-${index}`}
                            to={`/student/result/${firstCourse.student}?level=${firstCourse.level}&semester=${result.semester}`}
                            className="block p-4 border-purple-800 rounded-2xl bg-purple-600 hover:bg-purple-500 transition-colors"
                        >
                            <h3 className="text-xl font-bold">{firstCourse.level}</h3>
                            <p className="text-lg font-semibold mb-2">{result.semester}</p>
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-lg font-medium">Check Result</p>
                                <img 
                                    src="/images/back-button.svg" 
                                    alt="View results" 
                                    className="w-6 h-6 rotate-180"
                                />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}