import mongoose from 'mongoose'

const RequestSchema = new mongoose.Schema({
          requestor: {
                    required: true,
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Users',
          },
          eventName: {
                    required: true,
                    type: String
          },
          eventLocation: {
                    required: true,
                    type: String
          },
          vehicle: {
                    required: true,
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Vehicles',
          },
          deploymentOdometer: {
                    type: Number
          },
          returnedOdometer: {
                    type: Number
          },
          startDate: {
                    require: true,
                    type: Date,
          },
          endDate: {
                    require: true,
                    type: Date
          },

          status: {
                    type: String,
                    default: 'Pending',
                    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed']
          },
          reviewedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Admins'
          },
          message: String


}, { timestamps: true })



export default mongoose.model('Requests', RequestSchema)