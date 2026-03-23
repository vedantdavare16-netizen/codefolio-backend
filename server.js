const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

/* MIDDLEWARE FIRST */
app.use(cors());
app.use(express.json());

/* ROUTES AFTER */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/portfolio", require("./routes/portfolio"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.get("/", (req, res) => {
  res.send("CodeFolio Backend Running 🚀");
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});