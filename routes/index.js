import express from 'express'
import authRoutes from './authRoutes.js'
import vehicleRoutes from './vehicleRoutes.js'
import adminRoutes from './adminRoutes.js'
import requestRoutes from './requestRoutes.js'
import userRoutes from './userRoutes.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import activityRoutes from './activityRoutes.js'
import generalRoutes from './generalRoutes.js'
const router = express.Router()

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/vehicles', requireAuth, vehicleRoutes)
router.use('/requests', requireAuth,  requestRoutes)
router.use('/users', requireAuth, userRoutes)
router.use('/activities', requireAuth, activityRoutes)
router.use('/general', generalRoutes)
export default router