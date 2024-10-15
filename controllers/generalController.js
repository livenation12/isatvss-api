import User from "../models/User.js"
import Vehicle from "../models/Vehicle.js"
import Request from "../models/Request.js"

export const counts = async (req, res) => {
          return res.status(200).json({
                    success: true, data: {
                              users: await User.countDocuments(),
                              vehicles: await Vehicle.countDocuments(),
                              requests: {
                                        total: await Request.countDocuments(),
                                        pending: ""
                              }
                    }
          })
}