const pdfTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .university { font-size: 24px; font-weight: bold; }
        .student-info { margin-bottom: 30px; }
        .result-table { width: 100%; border-collapse: collapse; }
        .result-table th, .result-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .result-table th { background-color: #f2f2f2; }
        .footer { margin-top: 30px; font-size: 12px; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <div class="university">Federal University of Technology Akure</div>
        <div class="school"><%= faculty %></div>
        <div class="department">Department of <%= department %></div>
        <h3>OFFICIAL RESULT SLIP</h3>
    </div>

    <table class="result-table">
        <thead>
            <tr>
                <th>Course Code</th>
                <th>Score</th>
                <th>Grade</th>
            </tr>
        </thead>
        <tbody>
            <% results.forEach(result => { %>
                <tr>
                    <td><%= result.courseCode %></td>
                    <td><%= Number(result.testScore || 0) + Number(result.examScore || 0) %></td>
                    <td><%= result.grade %></td>
                </tr>
            <% }); %>
        </tbody>
    </table>

    <div class="summary">
        <p><strong>Semester GPA:</strong> <%= studentGpa.toFixed(2) %></p>
        <p><strong>Cumulative GPA:</strong> <%= studentCgpa %></p>
        <p><strong>Status:</strong> <%= studentCgpa >= 1.5 ? 'Pass' : 'Probation' %></p>
    </div>
    <footer style="margin-top: 40px; font-size: 14px; text-align: right;">
        <p><strong>SIGNED</strong>: Registrar</p>
    </footer>
</body>
</html>
`;

module.exports = pdfTemplate;