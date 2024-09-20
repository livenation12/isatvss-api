import mongoose from 'mongoose'

const RequestSchema = new mongoose.Schema({
          requestor: {
                    required: true,
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
          },
          vehicle: {
                    require: true,
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Vehicles',
          },
          startDate: {
                    require: true,
                    type: String,
          },
          endDate: {
                    require: true,
                    type: String
          },
          status: {
                    type: String,
                    default: 'Pending',
                    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled']
          },
          reviewedBy: {
                    type: String
                    // type: mongoose.Schema.Types.ObjectId,
                    // ref: 'Admins'
          },
          message: String


}, { timestamps: true })



export default mongoose.model('Requests', RequestSchema)