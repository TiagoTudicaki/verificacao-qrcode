const express = require("express");
const pickupController = require("../controllers/pickupController");
const router = express.Router();

router.post("/pickup", pickupController.create);

module.exports = router;