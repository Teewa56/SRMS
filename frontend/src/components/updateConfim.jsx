import {getCurrentSemester} from '../api/adminApi'
import { useEffect, useState } from 'react';
import handleApiError from '../apiErrorHandler';

export default function ConfirmUpdate({ onConfirm, onDiscard }) {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSemester, setCurrentSemester] = useState(null);

    useEffect(() => {
        async function fetchSemester(){
            try{
                setLoading(true);
                const res = await getCurrentSemester();
                setCurrentSemester(res.data.currentSemester);
            }catch(err){
                handleApiError(err, setError, "Failed to get Semester")
            }finally{
                setLoading(false);
            }
        }
        fetchSemester()
    }, [])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-30 z-50 p-4">
            <div className="bg-green-400 rounded-2xl shadow-lg p-4 flex flex-col items-center gap-4 min-w-[200px]">
                <p className="text-lg font-semibold text-white">Do you want to update the semester?, this action is irriversible</p>
                {loading ? <p>.......</p> : (
                    <div>
                        <p className='font-bold text-white'>Current Semester: {currentSemester}</p>
                    </div>
                ) }
                {error && <p>{error}</p> }
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-600 transition"
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