export default function Landing() {
    function gotoSignIn(user) {
        localStorage.setItem('userType', user);
        window.location.href = '/signIn';
    }
    return (
        <div className="rounded-full h-screen flex items-center justify-center font-semibold p-4 text-xl">
            <div className="flex flex-col gap-1 items-center w-full max-w-md rounded-2xl p-4">
                <div className='text-center'>
                    <p className="">Hi 👋 , Welcome to Result Management System</p>
                </div>
                <div 
                    onClick={() => gotoSignIn('student')}
                    className="flex flex-col items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/studentSVG.svg" className="w-12 h-12" alt="img_student" />
                    <p className="text-xs">Student</p>
                    <button className='px-6 text-xs mt-4 text-white py-2 rounded-xl bg-gradient-to-r from-green-300 to-green-500'>Sign In As Student</button>
                </div>
                <div 
                    onClick={() => gotoSignIn('lecturer')}
                    className="flex flex-col items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/lecturerSVG.svg" className="w-12 h-12" alt="img_student" />
                    <p className="text-xs">Lecturer</p>
                    <button className='px-6 text-xs mt-4 text-white py-2 rounded-xl bg-gradient-to-r from-green-300 to-green-500'>Sign In As Lecturer</button>
                </div>
                <div 
                    onClick={() => gotoSignIn('admin')}
                    className="flex flex-col items-center shadow-lg w-full rounded-2xl p-4">
                    <img src="/images/adminSVG.svg" className="w-12 h-12" alt="img_student" />
                    <p className="text-xs">Admin</p>
                    <button className='px-6 text-xs mt-4 text-white py-2 rounded-xl bg-gradient-to-r from-green-300 to-green-500'>Sign In As Admin</button>
                </div>
            </div>
        </div>
    )
}
