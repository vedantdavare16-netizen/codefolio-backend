const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Project = require("../models/Project");

// Public profile route
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await Project.find({ owner: user._id });

    res.json({
      name: user.name,
      username: user.username,
      bio: user.bio,
      projects
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;