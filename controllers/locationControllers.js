const mongoose = require('mongoose');
const Location = require('../model/location'); 

/**
 * @description Create a new location
 * @route /locations
 * @method POST 
 */
module.exports.createLocation = async (req, res) => {
    try {
        const newLocation = await Location.create(req.body);
        res.status(201).json(newLocation);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

/**
 * @description Get all locations sorted by most recent start date
 * @route /locations
 * @method GET 
 */
module.exports.getAllLocation = async (req, res) => {
    try {
        const locations = await Location.find().populate('carId').sort({ createdAt: -1 });
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Afficher le détail d'un location
 * @route /locations/:id
 * @method GET
 */

module.exports.getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @description Mettre à jour la location
 * @route /locations/:id
 * @method PUT
 */

module.exports.updateLocation = async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(req.params.id, 
            req.body, 
            { new: true, 
            runValidators: true });
        if (!updatedLocation) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.status(200).json({ message: "Location updated successfully", updatedLocation });
    } catch (error) {

            res.status(500).json({ message: error.message });
    }
    
};

/**
 * @description Supprimer la location
 * @route /locations/:id
 * @method DELETE
 */

module.exports.deleteLocation = async (req, res) => {
    try {
        const deletedLocation = await Location.findByIdAndDelete(req.params.id);
        if (!deletedLocation) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @description Vérifier si une location est possible et simule le prix de location  "Etat : disponible, en location Prix: prix total de la location"
 * @route /locations/check 
 * @method POST
 */

module.exports.checkLocationAvailability = async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;

        // Check if dates are valid
        if (!startDate || !endDate || new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: "Invalid start or end date." });
        }

        // Check if car is available for the given dates
        const existingLocation = await Location.findOne({
            carId,
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        });

        if (existingLocation) {
            return res.status(200).json({ status: "en location", message: "Car is already rented for the selected dates." });
        }

        // Simulate price calculation (example: $50 per day)
        const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        const price = days * 50; // Example price per day

        res.status(200).json({ status: "disponible", price });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @description Démarrer la location
 * @route /locations/:id/demarrer
 * @method POST
 */

module.exports.startLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, {
            startDate: new Date()
        }, { new: true });

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location started successfully", location });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
*@description Terminer la location
*@route /locations/:id/terminer
*@method POST 
*/

module.exports.endLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndUpdate(req.params.id, {
            endDate: new Date()
        }, { new: true });

        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }

        res.status(200).json({ message: "Location ended successfully", location });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};