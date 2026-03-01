const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");
const protect = require("../middleware/authMiddleware");

// Create Project
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, githubLink, liveLink } = req.body;

    const project = new Project({
      title,
      description,
      githubLink,
      liveLink,
      owner: req.user.id,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Logged In User Projects
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Project
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/:id", protect, async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Check ownership
  if (project.owner.toString() !== req.user.id) {
    return res.status(401).json({ message: "Not authorized" });
  }

  project.title = req.body.title || project.title;
  project.description = req.body.description || project.description;
  project.githubLink = req.body.githubLink || project.githubLink;
  project.liveLink = req.body.liveLink || project.liveLink;

  const updatedProject = await project.save();

  res.json(updatedProject);
});

module.exports = router;