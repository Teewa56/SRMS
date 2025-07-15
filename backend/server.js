require('dotenv').config();
const connectDb = require('./config/db');
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs')
const path = require('path')

const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const limiter = require('./middleware/ratelimiter');

const app = express();
const deployedFrontendURL = 'https://srms-liard.vercel.app';
app.use(cors({
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    origin: ['http://localhost:5173', deployedFrontendURL]
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use(limiter); 
app.set('trust proxy', 1);  

app.get('/', (req, res) => {
    res.send('Server is running successfully');
});

const pdfsDir = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir);
}

const server = http.createServer(app);
const port = process.env.PORT;
connectDb().then(() => {
    server.listen(port, () => {
        console.log(`Server listening at port: ${port}`)
    });
}).catch((error) => {
    console.log(`Error: ${error}`);
});