import Activity from "../models/Activity.js";

export const activities = async (req, res) => {
          try {
                    const fetchActivities = await Activity.find();
                    res.status(200).json({ data: fetchActivities, success: true })
          } catch (error) {
                    res.status(400).json(error)
          }
}