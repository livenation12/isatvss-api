import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
          admin: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Users",
          },
          model: {
                    type: String,
                    required: true,
          },
          year: {
                    type: String,
                    required: true,
          },
          color: {
                    type: String,
                    required: true,
          },
          maxCapacity: {
                    type: Number,
                    required: true,
          },
          licensePlate: {
                    type: String,
                    required: true,
                    unique: true
          },
          images: {
                    type: [String],
                    required: true,
          },
})

export default mongoose.model("Vehicles", vehicleSchema)