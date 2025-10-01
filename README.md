# Student Result Management System (SRMS)

A comprehensive web-based result management system for educational institutions, built with the MERN stack (MongoDB, Express, React, Node.js).

### NOTE: 
Check the frontend/src/api/adminApi, lecturerApi, studentApi and follow the instruction in the comment

## 🚀 Features

### For Students
- View semester and cumulative results
- Check GPA and CGPA
- Track carry-over courses
- Download result slips as PDF
- Receive results via email

### For Lecturers
- Upload course results
- View assigned courses
- Edit results before release
- View registered students per course

### For Admins
- Manage students, lecturers, and admin accounts
- Register courses for semesters
- Release results to students
- Preview results before release
- Update semester/level progression
- Generate and email PDF result slips

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Gmail account (for email services)
- Cloudinary account (for image uploads)

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URL=your_mongodb_connection_string
PORT=5000
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

4. Start the server:
```bash
nodemon
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_DEPLOYED_BACKEND_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

4. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # Email and PDF services
├── middleware/      # Rate limiting
└── templates/       # PDF templates

frontend/
├── src/
│   ├── api/        # API integration
│   ├── auth/       # Authentication pages
│   ├── components/ # Reusable components
│   ├── context/    # React context
│   └── error/      # Error handling
```

## 🔐 Authentication

The system uses role-based authentication with three user types:

- **Admin**: Email + Password
- **Lecturer**: Work Email + Work ID
- **Student**: School Email + Matric Number

## 📊 Grading System
```
| Marks | Grade | Points | Description |
|-------|-------|--------|-------------|
| 70-100% | A | 5 | Excellent |
| 60-69% | B | 4 | Very Good |
| 50-59% | C | 3 | Good |
| 45-49% | D | 2 | Average |
| 40-44% | E | 1 | Satisfactory |
| 0-39% | F | 0 | Very Weak |
```
## 🎓 Supported Programs

### School of Computing
- Computer Science
- Cyber Security
- Information Technology
- Software Engineering

Each program supports 5 levels (100-500) with two semesters per level.

## 🔌 API Endpoints

### Admin Routes
```
POST   /api/admin/admins/signin
POST   /api/admin/admins/create
GET    /api/admin/students
POST   /api/admin/students/create
DELETE /api/admin/students/delete/:studentId
POST   /api/admin/results/release
```

### Lecturer Routes
```
POST   /api/lecturer/signin
GET    /api/lecturer/:lecturerId/courses-taking
POST   /api/lecturer/:lecturerId/upload-result
PUT    /api/lecturer/result/edit/:lecturerId
```

### Student Routes
```
POST   /api/student/signin
GET    /api/student/results/:studentId
GET    /api/student/gpa/:studentId
GET    /api/student/carry-over-courses/:studentId
```

## 📧 Email Configuration

The system uses Nodemailer with Gmail. To set up:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password
3. Add the credentials to your `.env` file

## 🖼️ Image Upload

Profile pictures are uploaded to Cloudinary. Configure your Cloudinary credentials in the frontend `.env` file.

## 🚦 Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## 📱 CORS Configuration

The backend accepts requests from:
- `http://localhost:5173` (local development)
- Production frontend URL (configure in `server.js`)

## 🔒 Security Features

- Password hashing with bcrypt
- HTTP-only cookies
- CORS protection
- Rate limiting
- Input validation
- Unique constraint on student/lecturer IDs

## 📝 Notes

- Students automatically progress to the next semester/level
- Courses with scores below 40% are marked as carry-overs
- PDF result slips are generated and emailed automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, email the examination office or contact your system administrator.

## 🔄 Version

Current Version: 1.0.0

---

Built with ❤️ for educational institutions
