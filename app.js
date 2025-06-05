require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const projectRoutes = require("./routes/project");
const multer = require("multer");
const cors = require('cors');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const port = process.env.PORT || 8000;
const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://Vishant:<db_password>@vishant.mqodd7u.mongodb.net/?retryWrites=true&w=majority&appName=Vishant)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", projectRoutes);

app.get("/", (req, res) => {
  res.render("home", { message: null, project: {} });
});

// Error handling middleware for Multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).render("edit-project", {
      project: req.body,
      message: `File upload error: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).render("edit-project", {
      project: req.body,
      message: err.message || "An error occurred",
    });
  }
  next();
});

app.listen(port, () => console.log(`Server started at PORT: ${port}`));
