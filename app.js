const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const projectRoutes = require("./routes/project");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config(); // Load .env file

const port = process.env.PORT || 8000;
const app = express();

// CORS configuration to allow origins from .env
const corsOriginsEnv = process.env.CORS_ORIGINS || "*";
const corsOrigins = corsOriginsEnv === "*" ? "*" : corsOriginsEnv.split(",");
if (!process.env.CORS_ORIGINS) {
  console.warn('Warning: CORS_ORIGINS environment variable not set. Defaulting to "*"');
}
app.use(
  cors({
    origin: corsOrigins, // Use * or specific origins from .env
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up view engine (still needed for other routes like home, edit)
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
