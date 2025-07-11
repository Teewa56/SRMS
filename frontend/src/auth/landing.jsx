import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();

    function gotoSignIn(user) {
        localStorage.setItem('userType', user);
        navigate('/signIn');
    }
    return (
        <div className="rounded-full h-screen flex items-center justify-center font-semibold p-4 text-xl">
            <div className="flex bg-white flex-col gap-1 items-center w-full max-w-md rounded-2xl shadow-lg p-4">
                <div className='text-center'>
                    <p className="">Hi 👋 , Welcome to Result Management System</p>
                </div>
                <div 
                    onClick={() => gotoSignIn('student')}
                    className="flex flex-col items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/studentSVG.svg" className="w-12 h-12" alt="img_student" />
                    <p>Student</p>
                    <button className='px-6 text-white py-2 rounded-xl bg-gradient-to-r from-purple-300 to-fuchsia-500'>Continue</button>
                </div>
                <div 
                    onClick={() => gotoSignIn('lecturer')}
                    className="flex flex-col items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/lecturerSVG.svg" className="w-12 h-12" alt="img_student" />
                    <p>Lecturer</p>
                    <button className='px-6 text-white py-2 rounded-xl bg-gradient-to-r from-purple-300 to-fuchsia-500'>Continue</button>
                </div>
                <div 
                    onClick={() => gotoSignIn('admin')}
                    className="flex flex-col items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/adminSVG.svg" className="w-12 h-12" alt="img_student" />
                    <p>Admin</p>
                    <button className='px-6 text-white py-2 rounded-xl bg-gradient-to-r from-purple-300 to-fuchsia-500'>Continue</button>
                </div>
            </div>
        </div>
    )
}
