import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './auth/landing';
import NotFoundError from './error/Notfound';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import ErrorBoundary from './error/ErrorBoundary';
import SignIn from './auth/signIn';
import CreateAccount from './auth/createAccount';
//Admin Routes
import { AdminHome } from './users/admin/adminHome';
import NewStudent from './users/admin/NewStudent';
import NewLecturer from './users/admin/NewLetcurer';
import ProfileListPage from './users/admin/profileListPage';
import PreviewResult from './users/admin/ResultPreview';
import EditAdmin from './users/admin/EditAdmin';
import EditStudent from './users/admin/EditStudent'
import EditLecturer from './users/admin/EditLecturer'
//Lecturer Routes
import LecturerHome from './users/lecturer/lecturerHome';
import UploadResult from './users/lecturer/UploadResuslt';
import EditResult from './users/lecturer/editResults'
//StudentRoutes
import StudentHome from './users/student/studentHome';
import Results from './users/student/resultsPage';
import Result from './users/student/resultPage';
import './App.css';

const App = () => {
  const { isAuth } = useContext(AuthContext);
  const userType = localStorage.getItem('userType');
  function StudentRoutes({ children }) {
    if (userType !== 'student') {
      return <Navigate to={`/${userType}`} replace />;
    }
    return children;
  }

  function LecturerRoutes({ children }) {
    if (userType !== 'lecturer') {
      return <Navigate to={`/${userType}`} replace />;
    }
    return children;
  }

  function AdminRoutes({ children }) {
    if (userType !== 'admin') {
      return <Navigate to={`/${userType}`} replace />;
    }
    return children;
  }

  if(!navigator.onLine) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div className='flex flex-col items-center gap-2'>
          <img 
            src="/images/error.svg" 
            alt="Error image" 
            className='w-10 h-10'/>
          <h1 className="text-2xl font-bold">You are offline</h1>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>          
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to={`/${userType}`} replace /> : <Landing />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/newAdmin' element={<CreateAccount />} />
          
          <Route path="/admin" element={<AdminRoutes><AdminHome /></AdminRoutes>} />
          <Route path="/admin/newStudent" element={<AdminRoutes><NewStudent /></AdminRoutes>} />
          <Route path="/admin/newLecturer" element={<AdminRoutes><NewLecturer /></AdminRoutes>} />
          <Route path="/admin/profiles" element={<AdminRoutes><ProfileListPage /></AdminRoutes>} />
          <Route path='/admin/resultPreview' element={<AdminRoutes><PreviewResult /></AdminRoutes>} />
          <Route path='/admin/editAdmin' element={<AdminRoutes><EditAdmin /></AdminRoutes>} />
          <Route path='/admin/editLecturer' element={<AdminRoutes><EditLecturer /></AdminRoutes>} />
          <Route path='/admin/editStudent' element={<AdminRoutes><EditStudent /></AdminRoutes>} />

          <Route path='/lecturer' element={<LecturerRoutes><LecturerHome /></LecturerRoutes>} />
          <Route path='/lecturer/uploadResult' element={<LecturerRoutes><UploadResult /></LecturerRoutes>} />
          <Route path='/lecturer/editResult/:CourseCode' element={<LecturerRoutes><EditResult /></LecturerRoutes>} />
          
          <Route path='/student' element={<StudentRoutes><StudentHome /></StudentRoutes>} />
          <Route path='/student/results' element={<StudentRoutes><Results /></StudentRoutes>} />
          <Route path='/student/result/:studentId' element={<StudentRoutes><Result /></StudentRoutes>} />

          <Route path="*" element={<NotFoundError />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;