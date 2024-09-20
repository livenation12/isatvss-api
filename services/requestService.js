import Request from "../models/Request.js"
import { transporter, baseMailOptions } from "./mailerService.js"
export const createNewRequest = async (data) => {
          try {
                    // Create a new request
                    const newRequest = new Request(data);
                    const savedRequest = await newRequest.save();

                    if (savedRequest) {
                              // Populate related data
                              const fullDetails = await Request.findById(savedRequest._id)
                                        .populate('vehicle')
                                        .populate('requestor', '-password');

                              // Prepare mail options and send email
                              const mailOptions = requestMailOptions(fullDetails);
                              const sendRequestMail = await transporter.sendMail(mailOptions);

                              // If email was sent, return the populated request details
                              if (sendRequestMail) {
                                        return fullDetails;
                              } else {
                                        throw new Error('Failed to send email');
                              }
                    } else {
                              throw new Error('Request save failed');
                    }
          } catch (error) {
                    console.error('Error creating new request:', error);
                    throw error; // Re-throw the error to be handled by the caller
          }
};


export const getUserRequests = async (userId) => {
          return await Request.find({ requestor: userId })
                    .populate('vehicle')
}

export const getAllRequests = async () => {
          return await Request.find().populate({
                    path: 'requestor',
                    select: '-password' // Exclude password
          }).populate('vehicle'); // Populate vehicle without excluding fields
}

export const updateRequestById = async (id, data) => {
          try {
                    const updatedRequest = await Request.findByIdAndUpdate(id, data, { new: true })
                              .populate('requestor', '-password')
                              .populate('vehicle');
                    const mailOptions = requestResponseMailOptions(updatedRequest);
                    const sendResponseRequestMail = await transporter.sendMail(mailOptions);
                    if (sendResponseRequestMail) {
                              return updatedRequest
                    } else {
                              throw new Error('Failed to send email');
                    }
          } catch (error) {
                    console.error('Error updating request:', error);
                    throw error;
          }
}

const requestResponseMailOptions = (request) => {
          return {
                    ...baseMailOptions,
                    to: request.requestor.email,
                    subject: 'Vehicle Scheduling System (VSS) - Request Response',
                    text: `Your request has been ${request.status.toUpperCase()}!
                    You requested for a vehicle with details:
                    Model - ${request.vehicle.model}
                    License Plate - ${request.vehicle.licensePlate}
                    For dates: ${new Date(request.startDate)} - ${new Date(request.endDate)}
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
                    `
          }
}

