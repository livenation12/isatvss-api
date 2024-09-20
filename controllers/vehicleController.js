import { getAllVehicles, create, getVehicleById, updateVehicleById } from "../services/vehicleService.js"
import Vehicle from "../models/Vehicle.js";
export const getVehicles = async (req, res) => {
          try {
                    const vehicles = await getAllVehicles();
                    res.status(200).json({ data: vehicles })
          } catch (error) {
                    res.status(400).json(error)
          }
}

export const getVehicle = async (req, res) => {
          try {
                    const vehicle = await getVehicleById(req.params.vehicleId)
                    res.status(200).json({ data: vehicle })
          } catch (error) {
                    res.status(400).json(error)
          }
}

export const createVehicle = async (req, res) => {
          try {
                    // Extract vehicle data from the request body
                    const vehicleData = req.body;

                    // Include only the filenames of uploaded files
                    if (req.files && req.files.length > 0) {
                              vehicleData.images = req.files.map(file => file.filename);
                    }

                    // Create a new vehicle with the associated file names
                    const newVehicle = await create(vehicleData);
                    res.status(201).json({ success: true, created: newVehicle });
          } catch (error) {
                    // Return appropriate status codes based on error type
                    const statusCode = error.statusCode || 500;  // Default to 500 if no status code provided
                    res.status(statusCode).json({ error: error.message });
          }
};

export const updateVehicle = async (req, res) => {
          try {
                    const updatedData = { ...req.body };

                    // Check if files are uploaded
                    if (req.files && req.files.length > 0) {
                              const newImageFilenames = req.files.map(file => file.filename);

                              // Fetch the existing vehicle to combine images
                              const vehicle = await Vehicle.findById(req.params.vehicleId);
                              if (!vehicle) {
                                        return res.status(404).json({ message: "Vehicle not found" });
                              }

                              // Combine existing images with new ones
                              updatedData.images = [...vehicle.images, ...newImageFilenames];
                    }

                    // Update the vehicle
                    const updatedVehicle = await updateVehicleById(req.params.vehicleId, updatedData);

                    if (updatedVehicle) {
                              return res.status(200).json({ data: updatedVehicle, success: true });
                    } else {
                              return res.status(500).json({ message: "Error updating the vehicle" });
                    }
          } catch (error) {
                    res.status(400).send(error.message);
          }
};

export const deleteVehicle = async (req, res) => {
          try {
                    console.log(req.params.vehicleId);
                    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.vehicleId);
                    if (deletedVehicle) {
                              return res.status(200).json({ data: deletedVehicle, success: true });
                    } else {
                              return res.status(500).json({ message: "Error deleting the vehicle" });
                    }
          } catch (error) {
                    res.status(400).send(error.message);
          }
};