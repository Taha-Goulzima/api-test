const express = require("express");
const router = express.Router();
const carController = require("../controllers/carsControler");  

// Routes
router.post("/", carController.createCar);
router.get("/", carController.getAllCars);
router.get("/:id", carController.getCar);
router.put("/:id", carController.putCar);
router.delete("/:id", carController.deleteCar);

module.exports = router;
