const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const userCtrl = require("../controllers/userController");

router.get("/", auth, role("admin"), userCtrl.getAllUsers);
router.get("/:id", auth, userCtrl.getUserProfile);
router.put("/:id", auth, userCtrl.updateUserProfile);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;
