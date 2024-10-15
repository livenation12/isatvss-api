import ValidationError from "../controllers/errorHandler.js";
import Vehicle from "../models/Vehicle.js";
import Request from "../models/Request.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs"; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isLicensePlateExist = async (licensePlate) => {
          const vehicle = await Vehicle.findOne({ licensePlate });
          return vehicle;
}

export const getAllVehicles = async () => {
          // Fetch all vehicles
          const vehicles = await Vehicle.find();
          // Map over the vehicles array to handle async operations
          const vehiclesWithSchedules = await Promise.all(
                    vehicles.map(async (vehicle) => {
                              // Fetch requests related to the current vehicle
                              const vehicleRequests = await Request.find({ vehicle: vehicle._id, status: "Approved" }, 'startDate endDate');

                              // Dynamically add the schedules to the vehicle object
                              return {
                                        ...vehicle.toObject(), // Convert Mongoose document to a plain JavaScript object
                                        schedules: vehicleRequests // Add schedules property
                              };
                    })
          );
          return vehiclesWithSchedules;
};

export const getVehicleById = async (id) => {
          return await Vehicle.findById(id).populate('admin');
}

export const create = async (data) => {
          const licensePlateExist = await isLicensePlateExist(data.licensePlate);
          if (licensePlateExist) {
                    throw new ValidationError("Vehicle already exists", "licensePlate", 409);
          }
          const newVehicle = new Vehicle(data);
          return await newVehicle.save();
};

export const updateVehicleById = async (id, data) => {
          const updatedVehicle = await Vehicle.findByIdAndUpdate(id, data, { new: true });
          if (!updatedVehicle) {
                    throw new Error("Vehicle not found");
          }
          return updatedVehicle;
}

export const removeVehicleImageByVehicleId = async (vehicleId, imageName) => {
          try {
                    // Define the path to the image
                    const imagePath = join(__dirname, "..", "images", "vehicles", imageName);

                    // Delete the image file from the server
                    await fs.unlink(imagePath);

                    // After file deletion, update the database by removing the image reference
                    const vehicleWithRemovedImage = await Vehicle.findByIdAndUpdate(
                              vehicleId,
                              { $pull: { images: imageName } },  // Use $pull to remove the image from the array
                              { new: true }
                    );

                    if (!vehicleWithRemovedImage) {
                              throw new Error("Vehicle not found");
                    }

                    return vehicleWithRemovedImage;

          } catch (error) {
                    throw new Error(error.message || 'Error removing vehicle image');
          }
};
