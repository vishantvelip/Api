const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const projectRoutes = require("./routes/project");
const multer = require("multer");
const cors = require('cors');

const port = process.env.PORT || 8000;
const app = express();

// MongoDB connection


app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from Project 1
}));

mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://vishantvelip:<vishantvelip>@vishant.qceexb7.mongodb.net/?retryWrites=true&w=majority&appName=vishant")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
