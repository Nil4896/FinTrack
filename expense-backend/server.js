const express = require("express");
const dotenv = require("dotenv");
const path = require('path');
const cors = require("cors");
const connectDB = require("./src/config/db");

// Load env variables (ensure .env relative to this file is loaded regardless of CWD)
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Basic runtime checks for required env vars
if (!process.env.MONGO_URI) {
	console.error('❌ MONGO_URI is not set in .env. The app will not be able to connect to MongoDB.');
}
if (!process.env.JWT_SECRET) {
	console.warn('⚠️ JWT_SECRET is not set in .env. Authentication will fail without a JWT secret.');
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/user", require("./src/routes/user"));
app.use("/api/expenses", require("./src/routes/expenses"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
