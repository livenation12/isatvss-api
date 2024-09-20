import express from "express"
import { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js"
import { adminAuth } from "../middlewares/authMiddleware.js"
import { fileUpload } from "../middlewares/fileUploadMiddleware.js"
const router = express.Router()

router.get('/', getVehicles)
router.get('/:vehicleId', adminAuth, getVehicle)
router.post('/', adminAuth, fileUpload, createVehicle)
router.put('/:vehicleId', adminAuth, fileUpload, updateVehicle)
router.delete('/:vehicleId', adminAuth, deleteVehicle)
export default router