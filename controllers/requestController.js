import {
          createNewRequest,
          getUserRequests,
          getAllRequests,
          updateRequestById,
          filterRequests,
          approveRequestByIdAndUpdateVehicleOdometer,
          returnRequestByIdAndUpdateVehicleOdometer,
          getRequestsGroupedByMonthForYear,
          getVehicleUsageCounts
} from "../services/requestService.js";
import Vehicle from "../models/Vehicle.js";
export const createRequest = async (req, res) => {
          try {
                    const newRequest = await createNewRequest(req.body);

                    if (!newRequest.success) {
                              // Return a failure message from createNewRequest
                              return res.status(500).json({ message: newRequest.message, success: false });
                    }

                    // If success, return the request details
                    return res.status(201).json({
                              data: newRequest.fullDetails,
                              message: 'Request successfully created',
                              success: true
                    });

          } catch (error) {
                    // Catch general errors and return a 400 response
                    console.error('Error:', error);
                    return res.status(400).json({ message: 'Something went wrong', error });
          }
};

export const userRequests = async (req, res) => {
          try {
                    const requests = await getUserRequests(req.params.userId)
                    if (requests) {
                              return res.status(200).json({ data: requests, success: true })
                    }
                    return res.status(500).json({ message: "Error getting user requests" })
          } catch (error) {
                    return res.status(400).send(error);
          }
}

export const requests = async (req, res) => {
          try {
                    const requests = await getAllRequests();
                    if (requests) {
                              return res.status(200).json({ data: requests, success: true })
                    }
                    return res.status(500).json({ message: "Error getting requests" })

          } catch (error) {
                    return res.status(400).send(error);
          }
}

export const updateRequest = async (req, res) => {
          try {
                    const updatedRequest = await updateRequestById(req.params.requestId, req.body);
                    if (updatedRequest) {
                              return res.status(200).json({ data: updatedRequest, success: true })
                    }
                    return res.status(500).json({ message: "Error updating a request" })
          } catch (error) {
                    return res.status(400).send(error);
          }
}

export const getFilteredRequestByStatusAndDate = async (req, res) => {
          try {
                    const { status } = req.body;

                    // Validate that status is an array
                    if (!Array.isArray(status)) {
                              return res.status(400).json({ message: 'Status must be an array' });
                    }

                    // Get the current date and calculate the first and last day of the current month in UTC
                    const currentDate = new Date();
                    const firstDayLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                    const lastDayNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
                    const filters = {
                              status: { $in: status },
                              $and: [
                                        { startDate: { $gte: firstDayLastMonth, $lte: lastDayNextMonth } }, // Start date within the month
                              ]
                    };
                    const requests = await filterRequests(filters);
                    return res.status(200).json({ data: requests, success: true });
          } catch (error) {
                    // Handle errors and send an error response
                    console.error('Error fetching requests:', error);
                    return res.status(500).json({ message: 'An error occurred while fetching requests', error });
          }
};

export const getRequestsByDate = async (req, res) => {
          try {
                    let { date } = req.params;
                    date = new Date(date);
                    const requests = await filterRequests({
                              startDate: { $lte: date },
                              endDate: { $gte: date }
                    })
                    return res.status(200).json({ data: requests, success: true });
          } catch (error) {
                    console.error('Error fetching requests:', error.message, error.stack);
                    return res.status(500).json({ message: 'An error occurred while fetching requests', error });
          }
};

export const approveRequest = async (req, res) => {
          try {
                    const approvedRequest = await approveRequestByIdAndUpdateVehicleOdometer(req.params.requestId, req.body);
                    if (approvedRequest.success) {
                              // Ensure `approvedRequest.data.vehicle` contains the vehicle ID
                              const toUpdateVehicle = await Vehicle.findByIdAndUpdate(approvedRequest.data.vehicle._id, { odoMeter: approvedRequest.data.deploymentOdometer }, { new: true });
                              if (toUpdateVehicle) {
                                        return res.status(200).json(approvedRequest);
                              } else {
                                        return res.status(400).json({ success: false, message: 'Failed to update vehicle odometer' });
                              }
                    } else {
                              return res.status(400).json({ success: false, message: 'Failed to approve request' });
                    }
          } catch (error) {
                    console.error('Error approving request:', error);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
          }
};

export const returnRequest = async (req, res) => {
          try {
                    const returnedRequest = await returnRequestByIdAndUpdateVehicleOdometer(req.params.requestId, req.body);
                    if (returnedRequest.success) {
                              // Ensure `returnedRequest.data.vehicle` contains the vehicle ID
                              const toUpdateVehicle = await Vehicle.findByIdAndUpdate(returnedRequest.data.vehicle._id, { odoMeter: returnedRequest.data.deploymentOdometer }, { new: true });
                              if (toUpdateVehicle) {
                                        return res.status(200).json(returnedRequest);
                              } else {
                                        return res.status(400).json({ success: false, message: 'Failed to update vehicle odometer' });
                              }
                    } else {
                              return res.status(400).json({ success: false, message: 'Failed to return request' });
                    }
          } catch (error) {
                    console.error('Error returning request:', error);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
          }
}

export const requestGroupedByMonth = async (req, res) => {
          const { year } = req.params;
          try {
                    const requests = await getRequestsGroupedByMonthForYear(year);
                    return res.status(200).json({ data: requests, success: true });
          } catch (error) {
                    console.error('Error fetching requests:', error.message, error.stack);
                    return res.status(500).json({ message: 'An error occurred while fetching requests', error });
          }
}

export const vehicleUsageCount = async (req, res) => {
          try {
                    const requests = await getVehicleUsageCounts();
                    return res.status(200).json({ data: requests, success: true });
          } catch (error) {
                    console.error('Error fetching requests:', error.message, error.stack);
                    return res.status(500).json({ message: 'An error occurred while fetching requests', error });
          }
}