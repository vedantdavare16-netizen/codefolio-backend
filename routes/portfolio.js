const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Project = require("../models/Project");

// GET /api/portfolio/:username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({ user: user._id });

    res.json({
      name: user.name,
      bio: user.bio,
      skills: user.skills || [],
      template: user.template || "minimal",
      projects,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;