const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    techStack: [String],
    repoLink: String,
    liveLink: String
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
  type: String,
  required: true,
  unique: true
    },
email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
},
    password: {
    type: String,
    required: true,
    select: false
},
    bio: {
        type: String,
        default: ""
    },
    templateId: {
        type: Number,
        default: 1
    },
    skills: {
        type: [String],
        default: []
    },
    projects: [projectSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);