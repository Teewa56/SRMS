const pdfTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            position: relative;
            z-index: 1;
            /* Remove: font: bold 2px; */
            /* Remove: background properties here */
        }
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url('/futalogo.jpg') center/cover no-repeat;
            filter: blur(4px); /* Adjust blur as needed */
            opacity: 0.3;      /* Adjust opacity as needed */
            z-index: 0;
        }
        body > * {
            position: relative;
            z-index: 1;
        }
        .logo {
            width: 100px;
            height: 100px;
            background: url('/futalogo.jpg') center/cover no-repeat;
        }
        .header { text-align: center; margin-bottom: 10px; }
        .university { font-size: 24px; font-weight: bold; }
        .student-info { margin-bottom: 30px; }
        .result-table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
        .result-table th, .result-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .result-table th { background-color: #f2f2f2; }
        .footer { margin-top: 30px; font-size: 12px; text-align: center; }
        .grid-table {display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .center-table { margin-inline: auto; max-width: 50vw; }
        .center-table tr {text-align: center; width: 100%;}
        .center-table th, .center-table td { border: 1px solid #ddd; padding: 4px; text-align: left; }
    </style>
</head>
<body>
    <header style="display: flex; justify-content: flex-start; gap: 20px; align-items: start; margin-bottom: 20px;">
        <div class="logo">
        </div>
        <div class="header">
            <div class="university">Federal University of Technology, Akure</div>
            <div class="school"><%= faculty %></div>
            <div class="department">Department of <%= department %></div>
            <h3>OFFICIAL RESULT SLIP for <%= semester %>, <%= academicYear %> academic year</h3>
        </div>
    </header>

    <div>
        <p><strong>Name : </strong> <%= studentName %> </p>
        <p><strong>Matric Number : </strong> <%= matricNumber %> </p>
        <p><strong>Department : </strong> <%= department %> </p>
        <p><strong>Level : </strong> <%= level %> </p>
        <p><strong>Semester : </strong> <%= semester %> </p>
        <p><strong>Session : </strong> <%= academicYear %> </p>
    </div>

    <div class='grid-table'>
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
        <table class="result-table">
            <thead>
                <tr>
                    <th style="text-align: center;">Carry Over Courses</th>
                </th>
            </thead>
            <tbody>
                <% if (carryOver.length > 0) { %>
                    <% carryOver.forEach(function(result) { %>
                        <tr><td><%= result %></td></tr>
                    <% }); %>
                <% } else { %>
                    <tr><td style='text-align: center;'>No Carry Over Courses</td></tr>
                <% } %>
            </tbody>
        </table>
    </div>

    <div class="summary">
        <p><strong>Semester GPA:</strong> <%= studentGpa.toFixed(2) %></p>
        <p><strong>Cumulative GPA:</strong> <%= studentCgpa %></p>
        <p><strong>Status:</strong> <%= studentCgpa >= 1.5 ? 'Pass' : 'Probation' %></p>
    </div>
    <footer style="margin-top: 40px; font-size: 14px; text-align: right;">
        <p><strong>SIGNED</strong>: Registrar</p>
    </footer>

    <table class='center-table'>
        <thead>
            <tr>
                <th>Marks</th>
                <th>Grade</th>
                <th>Points</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>70%-100%</td>
                <td>A</td>
                <td>5</td>
                <td>Excellent</td>
            </tr>
            <tr>
                <td>60%-69%</td>
                <td>B</td>
                <td>4</td>
                <td>Very Good</td>
            </tr>
            <tr>
                <td>50%-59%</td>
                <td>C</td>
                <td>3</td>
                <td>Good</td>
            </tr>
            <tr>
                <td>45%-49%</td>
                <td>D</td>
                <td>2</td>
                <td>Average</td>
            </tr>
            <tr>
                <td>40-44%</td>
                <td>E</td>
                <td>1</td>
                <td>Satisfactory</td>
            </tr>
            <tr>
                <td>0-39%</td>
                <td>F</td>
                <td>0</td>
                <td>Very Weak</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;

module.exports = pdfTemplate;