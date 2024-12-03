const express = require("express");
const router = express.Router();

const locationControllers = require('../controllers/locationControllers');

// Routes for location management
router.get("/", locationControllers.getAllLocation);
router.post("/", locationControllers.createLocation);
router.get("/:id",locationControllers.getLocationById)
router.put("/:id",locationControllers.updateLocation)
router.delete("/:id",locationControllers.deleteLocation)
router.post("/check",locationControllers.checkLocationAvailability)
router.post('/:id/demarrer',locationControllers.startLocation)
router.post("/:id/terminer",locationControllers.endLocation)

module.exports = router;