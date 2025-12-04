const express = require("express");
const {
  getFamilies,
  createFullFamily,
} = require("../controllers/familyControllers");
const router = express.Router();

router.get("/", getFamilies);
router.post("/", createFullFamily);

module.exports = router;
