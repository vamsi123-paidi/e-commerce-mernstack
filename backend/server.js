const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const cors = require('cors');
const authRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
const app = express();

const corsOptions = {
  origin: 'https://e-commerce-mernstack.vercel.app', // Ensure there's no trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any additional headers your requests need
  credentials: true // Enable credentials if needed
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
