import express from "express"
import {counts} from "../controllers/generalController.js"
const router = express.Router()

router.get('/', counts)

export default router