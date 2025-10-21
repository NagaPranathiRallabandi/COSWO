const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// DB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/coswoDB';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));


// API Routes
app.use('/api/donations', require('./routes/donations'));
app.use('/api/receivers', require('./routes/receivers'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
    res.send('COSWO Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});