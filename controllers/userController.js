import User from "../models/User.js"

export const getUsers = async (req, res) => {
          try {
                    return res.status(200).json({ success: true, data: await User.find() })
          } catch (error) {
                    return res.status(400).json({ success: false, error })
          }
}

export const getUser = async (req, res) => {
          try {
                    return res.status(200).json({ success: true, data: await User.findById(req.params.userId) })
          } catch (error) {
                    return res.status(400).json({ success: false, error })
          }
}