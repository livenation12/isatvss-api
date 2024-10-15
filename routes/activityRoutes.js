import express from "express"
import { activities } from "../controllers/activityController.js"
const router = express.Router()

router.get('/', activities)

export default router
