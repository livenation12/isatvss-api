import { createNewRequest, getUserRequests, getAllRequests, updateRequestById } from "../services/requestService.js";


export const createRequest = async (req, res) => {
          try {
                    const newRequest = await createNewRequest(req.body);
                    if (newRequest) {
                              return res.status(201).json({ data: newRequest, message: 'Request successfully created', success: true })
                    }
                    return res.status(500).json({ message: "Error creating your request" })
          } catch (error) {
                    res.status(400).send(error);
          }
}

export const userRequests = async (req, res) => {
          try {
                    const requests = await getUserRequests(req.params.userId)
                    if (requests) {
                              return res.status(200).json({ data: requests, success: true })
                    }
                    return res.status(500).json({ message: "Error getting user requests" })
          } catch (error) {
                    res.status(400).send(error);
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
                    res.status(400).send(error);
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
                    res.status(400).send(error);
          }
}