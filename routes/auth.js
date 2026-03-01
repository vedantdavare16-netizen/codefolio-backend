const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/check", (req, res) => {
  res.send("Auth route working perfectly");
});


// REGISTER ROUTE
router.post("/register", async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

const jwt = require("jsonwebtoken");

// LOGIN ROUTE
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists (include hidden password)
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create token
        console.log("LOGIN SECRET:", process.env.JWT_SECRET);
        const token = jwt.sign(
         { id: user._id },
         process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
// ADD SKILL
router.post("/skills", authMiddleware, async (req, res) => {
    try {
        const { skill } = req.body;

        const user = await User.findById(req.user.id);

        user.skills.push(skill);
        await user.save();

        res.json(user.skills);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// ADD PROJECT
router.post("/projects", authMiddleware, async (req, res) => {
    try {
        const { title, description, github, live } = req.body;

        const user = await User.findById(req.user.id);

        const newProject = {
            title,
            description,
            github,
            live
        };

        user.projects.push(newProject);
        await user.save();

        res.json(user.projects);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// DELETE SKILL
router.delete("/skills", authMiddleware, async (req, res) => {
    try {
        const { skill } = req.body;

        const user = await User.findById(req.user.id);

        user.skills = user.skills.filter(
            (item) => item !== skill
        );

        await user.save();

        res.json(user.skills);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// DELETE PROJECT
router.delete("/projects/:projectId", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.projects = user.projects.filter(
            (project) => project._id.toString() !== req.params.projectId
        );

        await user.save();

        res.json(user.projects);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/test", (req, res) => {
    res.send("Auth route working");
});
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE PROFILE
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        const { name, bio, templateId } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, bio, templateId },
            { new: true }
        ).select("-password");

        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// ===============================
// PUBLIC PORTFOLIO ROUTE
// ===============================
router.get("/portfolio/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select("name username bio templateId skills projects");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// GET LOGGED IN USER
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;