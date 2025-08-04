const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const projectCtrl = require("../controllers/projectController");

router.post("/", auth, projectCtrl.createProject);
router.get("/", projectCtrl.getAllProjects);
router.get("/:id", projectCtrl.getProjectById);
router.put("/:id", auth, projectCtrl.updateProject);
router.delete("/:id", auth, projectCtrl.deleteProject);

module.exports = router;
