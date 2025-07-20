import axios from 'axios';

//const liveUrl = import.meta.env.VITE_DEPLOYED_BACKEND_URL
const localUrl = import.meta.env.VITE_BACKEND_LOCAL_URL;

const baseUrl = `${localUrl}/lecturer`;

const lecturerApi = axios.create({
    baseURL: baseUrl,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const lecturerSignIn = (data) => lecturerApi.post('/signin', data);
export const getLecturerProfile = (lecturerId) => lecturerApi.get(`/profile/${lecturerId}`);

export const getCoursesTaking = (lecturerId) => lecturerApi.get(`/${lecturerId}/courses-taking`);
export const getCourseStudents = (courseCode) => lecturerApi.get(`/course/${courseCode}/students`);

export const uploadCourseResult = (lecturerId, data) => lecturerApi.post(`/${lecturerId}/upload-result`, data);
export const editResult = (lecturerId, data) => lecturerApi.put(`/result/edit/${lecturerId}`, data);
export const getCourseResult = (lecturerId, courseCode) => lecturerApi.get(`/${lecturerId}/course-result?courseCode=${courseCode}`);

export default lecturerApi;