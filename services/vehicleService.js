import ValidationError from "../controllers/errorHandler.js";
import Vehicle from "../models/Vehicle.js";
import Request from "../models/Request.js";
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