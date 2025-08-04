const Project = require("../models/Project");
const User = require("../models/User");

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ users: [], projects: [] });

    const userResults = await User.find({
      username: { $regex: q, $options: "i" },
    }).select("username avatar bio");

    const projectResults = await Project.find({
      title: { $regex: q, $options: "i" },
    }).populate("user", "username avatar");

    res.json({ users: userResults, projects: projectResults });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
