import axios from 'axios';

//const liveUrl = import.meta.env.VITE_DEPLOYED_BACKEND_URL
const localUrl = import.meta.env.VITE_BACKEND_LOCAL_URL;

const baseUrl = `${localUrl}/student`;

const studentApi = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const studentSignIn = (data) => studentApi.post('/signin', data);
export const getStudentProfile = (studentId) => studentApi.get(`/profile/${studentId}`);

export const getAllResults = (studentId) => studentApi.get(`/results/${studentId}`);
export const getResult = (studentId, data) => studentApi.get(`/results/${studentId}`, data);

export const getGPA = (studentId) => studentApi.get(`/gpa/${studentId}`);
export const getCarryOverCourses = (studentId) => studentApi.get(`/carry-over-courses/${studentId}`);

export default studentApi;