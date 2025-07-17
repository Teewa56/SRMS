const nodeMailer = require('nodemailer');
const pdf = require('html-pdf')
const ejs = require('ejs')
const path = require('path')
require('dotenv').config()
const template = require('../templates/resultTemplates')

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const pdfOptions = {
    format: 'A4',
    border: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
    }
};
async function generatePdf(student, results) {
    const studentData = {
        matricNumber: student.matricNumber,
        studentName: student.fullName,
        semester: student.currentSemester,
        academicYear: student.currentSession,
        faculty: student.faculty,
        department: student.department,
        studentGpa: student.semesterGPA,
        studentCgpa: student.cgpa,
        results: results
    };

    try {
        const html = await ejs.render(template, studentData);

        const pdfDir = path.join(__dirname, 'pdfs');
        const pdfPath = path.join(pdfDir, `${student.matricNumber}_${student.currentSemester}_${student.currentLevel}_${Date.now()}.pdf`);

        return await new Promise((resolve, reject) => {
            pdf.create(html, pdfOptions).toFile(pdfPath, (err, res) => {
                if (err) {
                    console.error("PDF creation error:", err);
                    return reject(err);
                }
                resolve(res.filename);
            });
        });
    } catch (err) {
        console.error("generatePdf error:", err);
    }
}
const sendResult = async (student, pdfPath) => {
    try {
        const mailOptions = {
            from: `"Examination Office" <${process.env.EMAIL_USER}>`,
            to: student.schoolEmail,
            subject: `${student.currentSemester} Examination Results`,
            html: `
                <p>Dear ${student.fullName},</p>
                <p>Your ${student.currentSemester} examination results have been released.</p>
                <p>Please find attached your official result slip.</p>
                <p>GPA: ${student.semesterGPA.toFixed(2)}<br>
                CGPA: ${student.cgpa.toFixed(2)}</p>
                <p>Regards,<br>Examination Office</p>
            `,
            attachments: [{
                filename: `${student.fullName}_${student.currentSemester}_${student.currentLevel}.pdf`,
                path: pdfPath,
                contentType: 'application/pdf'
            }]
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Node mailer error:', error);
    }
};

module.exports = { generatePdf, sendResult };