// Import the necessary modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const connectDB=require('./utils/connectDB');
const dotenv=require('dotenv');
const userRoutes=require('./routes/userRoutes');
const adminRoutes=require('./routes/adminroutes');
dotenv.config();

// Create an instance of an Express application
const app = express();

// Enable essential middlewares
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true,
}));          // Enable CORS for all routes
app.use(cookieParser());  // Parse cookies from incoming requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(helmet());        // Set various HTTP headers for security

connectDB();
app.use('/api/user',userRoutes);
app.use('/api/admin',adminRoutes);



// Specify the port number
const PORT = process.env.PORT || 5500;

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});