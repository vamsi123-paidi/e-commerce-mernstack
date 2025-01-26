const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const cors = require('cors')
const authRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
const app = express();
app.use(cors({
  origin: 'https://e-commerce-mernstack.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));

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
