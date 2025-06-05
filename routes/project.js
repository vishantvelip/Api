
const { Router } = require("express");
const Project = require("../models/project");
const fs = require("fs").promises;
const path = require("path");
const upload = require("../middleware/multerConfig");
const mongoose = require("mongoose");

const router = Router();



router.get("/api-view",(req, res)=>{
    res.render("api-view")
})

// View all projects with search (return JSON)
router.get("/view", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const query = searchQuery
      ? {
          $or: [
            { name: { $regex: searchQuery, $options: "i" } },
            { title: { $regex: searchQuery, $options: "i" } },
          ],
        }
      : {};
    const projects = await Project.find(query);
    res.json(projects); // Return JSON instead of rendering EJS
  } catch (error) {
    res.status(500).json({ message: "Failed to load projects", error: error.message });
  }
});

// Create a new project
router.post("/create-project", upload.single("projectImg"), async (req, res) => {
  try {
    const { name, title, description } = req.body;
    if (!name || !title || !description) {
      return res.status(400).render("home", {
        project: req.body,
        message: "All fields are required",
      });
    }
    let projectImg = "";
    if (req.file) {
      projectImg = `uploads/${req.file.filename}`;
    }
    const newProject = new Project({
      name,
      title,
      description,
      projectImg,
    });
    await newProject.save();
    res.render("home", {
      project: {},
      message: "Project created successfully",
    });
  } catch (error) {
    res.status(500).render("home", {
      project: req.body,
      message: error.message || "Failed to create project",
    });
  }
});

// Get edit project form
router.get("/edit/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const projects = await Project.find();
      return res.status(400).render("view-project", {
        projects,
        message: "Invalid project ID",
        searchQuery: "",
      });
    }
    const project = await Project.findById(req.params.id);
    if (!project) {
      const projects = await Project.find();
      return res.status(404).render("view-project", {
        projects,
        message: "Project not found",
        searchQuery: "",
      });
    }
    res.render("edit-project", { project, message: null });
  } catch (error) {
    const projects = await Project.find();
    res.status(500).render("view-project", {
      projects,
      message: `Failed to load project: ${error.message}`,
      searchQuery: "",
    });
  }
});

// Update a project
router.post("/update-project/:id", upload.single("projectImg"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const projects = await Project.find();
      return res.status(400).render("view-project", {
        projects,
        message: "Invalid project ID",
        searchQuery: "",
      });
    }
    const { name, title, description } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) {
      const projects = await Project.find();
      return res.status(404).render("view-project", {
        projects,
        message: "Project not found",
        searchQuery: "",
      });
    }
    if (!name || !title || !description) {
      return res.status(400).render("edit-project", {
        project,
        message: "All fields are required",
      });
    }
    let projectImg = project.projectImg;
    if (req.file) {
      if (projectImg) {
        try {
          await fs.unlink(path.join(__dirname, "../public", projectImg));
        } catch (err) {}
      }
      projectImg = `uploads/${req.file.filename}`;
    }
    await Project.findByIdAndUpdate(req.params.id, {
      name,
      title,
      description,
      projectImg,
    });
    const projects = await Project.find();
    res.render("view-project", {
      projects,
      message: "Project updated successfully",
      searchQuery: "",
    });
  } catch (error) {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const projects = await Project.find();
      return res.status(404).render("view-project", {
        projects,
        message: "Project not found",
        searchQuery: "",
      });
    }
    res.status(500).render("edit-project", {
      project,
      message: error.message || "Failed to update project",
    });
  }
});

// Delete a project
router.post("/delete/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      const projects = await Project.find();
      return res.status(400).render("view-project", {
        projects,
        message: "Invalid project ID",
        searchQuery: "",
      });
    }
    const project = await Project.findById(req.params.id);
    if (!project) {
      const projects = await Project.find();
      return res.status(404).render("view-project", {
        projects,
        message: "Project not found",
        searchQuery: "",
      });
    }
    if (project.projectImg) {
      try {
        await fs.unlink(path.join(__dirname, "../public", project.projectImg));
      } catch (err) {}
    }
    await Project.findByIdAndDelete(req.params.id);
    const projects = await Project.find();
    res.render("view-project", {
      projects,
      message: "Project deleted successfully",
      searchQuery: "",
    });
  } catch (error) {
    const projects = await Project.find();
    res.status(500).render("view-project", {
      projects,
      message: "Failed to delete project",
      searchQuery: "",
    });
  }
});

module.exports = router;
