const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running ✅' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});