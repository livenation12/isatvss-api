import Request from "../models/Request.js"

export const checkDailyRequests = async (req, res, next) => {
          const { requestor } = req.body
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          try {
                    const recentRequest = await Request.findOne({
                              requestor,
                              createdAt: { $gte: today }
                    })

                    if (recentRequest) {
                              return res.status(400).json({success: false, message: "You have already made a request today, You can only make one request per day, try again tomorrow" })
                    }
                    next()
          } catch (error) {
                    res.status(400).json({success: false, message: "Error at checking daily requests", error: error.message })
          }
}