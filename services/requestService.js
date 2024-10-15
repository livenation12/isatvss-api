import Request from "../models/Request.js"
import { transporter, baseMailOptions } from "./mailerService.js"
const requestResponseMailOptions = (request) => {
          return {
                    ...baseMailOptions,
                    to: request.requestor.email,
                    subject: 'Vehicle Scheduling System (VSS) - Request Response',
                    text: `Your request has been ${request.status.toUpperCase()}!
                    For event ${request.eventName} at ${request.eventLocation}
                    You requested for a vehicle with details:
                    Model - ${request.vehicle.model}
                    License Plate - ${request.vehicle.licensePlate}
                    For dates: ${new Date(request.startDate)} - ${new Date(request.endDate)}
                    ${request.status === 'Approved' && `Odometer: ${request.deploymentOdometer}`}
                    `
          }
}

const requestMailOptions = (request) => {
          return {
                    ...baseMailOptions,
                    to: request.requestor.email,
                    subject: 'Vehicle Scheduling System (VSS) - Request',
                    text: `Your request has been sent!
                    You requested for a vehicle with details:
                    Model - ${request.vehicle.model}
                    License Plate - ${request.vehicle.licensePlate}
                    For dates: ${new Date(request.startDate)} - ${new Date(request.endDate)}
                    Please return well in time. Thank you
                    `
          }
}


export const createNewRequest = async (data) => {
          try {
                    // Create a new request
                    const newRequest = new Request(data);
                    const savedRequest = await newRequest.save();

                    if (!savedRequest) {
                              return { success: false, message: 'Failed to create request' };
                    }

                    // Populate related data
                    const fullDetails = await Request.findById(savedRequest._id)
                              .populate('vehicle')
                              .populate('requestor', '-password');

                    try {
                              // Prepare mail options and send email
                              const mailOptions = requestMailOptions(fullDetails);
                              const sendRequestMail = await transporter.sendMail(mailOptions);

                              if (!sendRequestMail) {
                                        return { success: false, warning: true, message: 'Request was successfully submitted but failed to send email notification, Please check your connection' };
                              }

                              // Return success with full request details if all steps are successful
                              return { success: true, fullDetails };

                    } catch (emailError) {
                              // Return failure for email sending
                              return { success: false, warning: true, message: 'Request was successfully submitted but failed to send email notification, Please check your connection' };
                    }

          } catch (error) {
                    // Handle general errors in request creation
                    return { success: false, message: 'Error creating request', error };
          }
};

export const getUserRequests = async (userId) => {
          return await Request.find({ requestor: userId })
                    .populate('vehicle')
                    .populate('requestor', '-password');
}

export const getAllRequests = async () => {
          return await Request.find().populate({
                    path: 'requestor',
                    select: '-password' // Exclude password
          }).populate('vehicle'); // Populate vehicle without excluding fields
}
export const filterRequests = async (filters) => {
          return await Request.find(filters).populate('requestor', '-password').populate('vehicle');
};


export const updateRequestById = async (id, data) => {
          try {
                    const updatedRequest = await Request.findByIdAndUpdate(id, data, { new: true })
                              .populate('requestor', '-password')
                              .populate('vehicle');
                    if (updatedRequest) {
                              try {
                                        const mailOptions = requestResponseMailOptions(updatedRequest);
                                        const sendResponseRequestMail = await transporter.sendMail(mailOptions);
                                        if (!sendResponseRequestMail) {
                                                  return { success: true, data: updatedRequest, warning: true, message: 'Successfully updated but failed to sent an email' }
                                        } else {
                                                  return { success: true, data: updatedRequest }
                                        }
                              } catch (error) {
                                        console.log(error);
                                        return { success: true, data: updatedRequest, warning: true, message: 'Successfully updated but failed to sent an email' }
                              }
                    }

          } catch (error) {
                    console.error('Error updating request:', error);
                    throw error;
          }
}

export const approveRequestByIdAndUpdateVehicleOdometer = async (id, data) => {
          if (!data.odoMeter) {
                    throw new Error('Odometer is required');
          }
          data.status = 'Approved';
          data.deploymentOdometer = data.odoMeter;
          return await updateRequestById(id, data);
}

export const returnRequestByIdAndUpdateVehicleOdometer = async (id, data) => {
          if (!data.odoMeter) {
                    throw new Error('Odometer is required');
          }
          data.status = 'Completed'
          data.returnedOdometer = data.odoMeter;
          return await updateRequestById(id, data);
}
// sample return 
// [
//           { _id: { year: 2024, month: 1 }, count: 15 },
//           { _id: { year: 2024, month: 2 }, count: 12 },
//           { _id: { year: 2024, month: 3 }, count: 20 },
//           // ... more data
//         ]
export const getRequestsGroupedByMonthForYear = async (year) => {
          const nextYear = year + 1;
          const requestsByMonth = await Request.aggregate([
                    {
                              $match: {
                                        startDate: {
                                                  $gte: new Date(`${year}-01-01`),  // Start of the year
                                                  $lt: new Date(`${nextYear}-01-01`) // Start of the next year
                                        }
                              }
                    },
                    {
                              $group: {
                                        _id: {
                                                  year: { $year: "$startDate" },
                                                  month: { $month: "$startDate" }
                                        },
                                        requests: { $sum: 1 }
                              }
                    },
                    {
                              $sort: { "_id.year": 1, "_id.month": 1 }
                    }
          ]);

          return requestsByMonth.map((item) => ({
                    year: item._id.year,
                    month: item._id.month, // Convert month number to name
                    requests: item.requests
          }))
};

export const getVehicleUsageCounts = async () => {
          try {
                    const vehicleUsage = await Request.aggregate([
                              {
                                        $match: {
                                                  status: { $in: ["Approved", "Completed"] } // Match only requests with Approved or Completed status
                                        }
                              },
                              {
                                        $group: {
                                                  _id: "$vehicle", // Grouping by the vehicle ID
                                                  count: { $sum: 1 } // Count the number of requests for each vehicle
                                        }
                              },
                              {
                                        $lookup: {
                                                  from: "vehicles", // Make sure this matches the actual name of your collection
                                                  localField: "_id", // Field from the group stage
                                                  foreignField: "_id", // Field from the vehicles collection
                                                  as: "vehicleDetails" // The output array field
                                        }
                              },
                              {
                                        $unwind: "$vehicleDetails" // Unwind the array to flatten the result
                              },
                              {
                                        $project: {
                                                  _id: 0, // Exclude the default ID field
                                                  vehicleId: "$_id", // Include the vehicle ID
                                                  vehicleModel: "$vehicleDetails.model", // Include vehicle model
                                                  vehicleLicensePlate: "$vehicleDetails.licensePlate", // Include vehicle license plate
                                                  count: 1 // Include the count
                                        }
                              },
                              {
                                        $sort: { count: -1 } // Sort by count in descending order
                              }
                    ]);

                    return vehicleUsage;
          } catch (error) {
                    console.error('Error fetching vehicle usage counts:', error);
                    throw error;
          }
};
