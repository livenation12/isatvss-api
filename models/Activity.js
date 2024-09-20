import mongoose from "mongoose";

const activitiesSchema = new mongoose.Schema({
          title: String,
          description: String,
          from: String,
          to: String
})
export default mongoose.model("Activities", activitiesSchema)