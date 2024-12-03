const Cars = require("../model/cars");

/**
 * @description Add a car
 * @route POST /car
 * @method POST
 */
module.exports.createCar = async (req, res) => {
  const { immatricule } = req.body;

  try {
    const existingCar = await Cars.findOne({ immatricule });
    console.log(req.body);
    if (existingCar) {
      return res.status(400).json({ message: "Registration already exists" });
    }

    const newCar = await Cars.create(req.body);
    return res
      .status(201)
      .json({ message: "New car added successfully", newCar });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * @description Show all cars
 * @route GET /car
 * @method GET
 */
module.exports.getAllCars = async (req, res) => {
  try {
    const carsList = await Cars.find().sort({ name: 1 });

    const updatedCarsList = carsList.map((car) => ({
      ...car.toObject(),
      nom: car.nom ? car.nom.toUpperCase() : car.nom,
    }));
    return res.status(200).json({
      message: "Cars retrieved successfully",
      carsList: updatedCarsList,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * @description Show one car by ID
 * @route GET /car/:id
 * @method GET
 */
module.exports.getCar = async (req, res) => {
  try {
    const car = await Cars.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res.status(200).json({ message: "Car retrieved successfully", car });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * @description Modify a car
 * @route PUT /car/:id
 * @method PUT
 */
module.exports.putCar = async (req, res) => {
  try {
    const updatedCar = await Cars.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res
      .status(200)
      .json({ message: "Car updated successfully", updatedCar });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * @description Delete a car
 * @route DELETE /car/:id
 * @method DELETE
 */
module.exports.deleteCar = async (req, res) => {
  try {
    const deletedCar = await Cars.findByIdAndDelete(req.params.id);

    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    return res
      .status(200)
      .json({ message: "Car deleted successfully", deletedCar });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
