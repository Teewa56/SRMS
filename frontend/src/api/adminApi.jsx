import axios from 'axios';

const liveUrl = import.meta.env.VITE_DEPLOYED_BACKEND_URL
//const localUrl = import.meta.env.VITE_BACKEND_LOCAL_URL;

const baseUrl = `${liveUrl}/admin`;

const adminApi = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const getAllAdmins = () => adminApi.get('/admins');
export const adminSignIn = (data) => adminApi.post('/admins/signin', data);
export const createAdminAccount = (data) => adminApi.post('/admins/create', data);
export const getAdminProfile = (adminId) => adminApi.get(`/admins/profile/${adminId}`);
export const editAdmin = (data, adminId) => adminApi.put(`/admins/edit/${adminId}`, data);
export const deleteAdmin = (adminId) => adminApi.delete(`/admins/delete/${adminId}`);

export const getAllLecturers = () => adminApi.get('/lecturers');
export const createLecturer = (data) => adminApi.post('/lecturers/create', data);
export const deleteLecturer = (lecturerId) => adminApi.delete(`/lecturers/delete/${lecturerId}`);
export const editLecturer = (lecturerId, data) => adminApi.put(`/lecturers/edit/${lecturerId}`, data);

export const getAllStudents = () => adminApi.get('/students');
export const createStudent = (data) => adminApi.post('/students/create', data);
export const deleteStudent = (studentId) => adminApi.delete(`/students/delete/${studentId}`);
export const editStudent = (studentId, data) => adminApi.put(`/students/edit/${studentId}`, data);

export const releaseResults = () => adminApi.post('/results/release');
export const previewResult = (data) => adminApi.post('/results/preview',  data );
export const registerCoursesForSemester = () => adminApi.post('/courses/register', {});
export const updateStudentSemesterLevel = () => adminApi.post('/students/update-semester', {});

export const getCurrentSemester = () => adminApi.get('/semester/current');

export default adminApi;