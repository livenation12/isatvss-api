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
          odoMeter: {
                    type: Number,
                    required: true,
          },
          images: {
                    type: [String],
                    required: true,
          },
}, {
          timestamps: true
})

export default mongoose.model("Vehicles", vehicleSchema)