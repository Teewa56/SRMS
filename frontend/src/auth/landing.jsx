import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    function gotoSignIn(user) {
        localStorage.setItem('userType', user);
        navigate('/signIn');
    }
    return (
        <div className="bg-purple-400 h-screen  flex items-center justify-center font-bold text-2xl p-4">
            <div className="flex flex-col gap-2 bg-white items-center w-full max-w-md rounded-2xl shadow-lg p-4">
                <div className='text-center mb-4 '>
                    <h1 className="text-2xl">Welcome to RMS</h1>
                    <p className="text-xl">Login As</p>
                </div>
                <div 
                    onClick={() => gotoSignIn('student')}
                    className="flex bg-purple-400 flex-col gap-2 items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/studentSVG.svg" className="w-16 h-16" alt="img_student" />
                    <p>Student</p>
                </div>
                <div 
                    onClick={() => gotoSignIn('lecturer')}
                    className="flex bg-purple-400 flex-col gap-2 items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/lecturerSVG.svg" className="w-16 h-16" alt="img_student" />
                    <p>Lecturer</p>
                </div>
                <div 
                    onClick={() => gotoSignIn('admin')}
                    className="flex bg-purple-400 flex-col gap-2 items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/adminSVG.svg" className="w-16 h-16" alt="img_student" />
                    <p>Admin</p>
                </div>
            </div>
        </div>
    )
}
