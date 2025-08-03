const express = require("express");
const router = express.Router();
const searchCtrl = require("../controllers/searchController");

router.get("/", searchCtrl.search);

module.exports = router;
