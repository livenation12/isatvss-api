import express from "express"
import { adminLogin, createAdmin, verifyAdminToken } from "../controllers/adminController.js"

const router = express.Router()

router.get('/verify', verifyAdminToken)
router.post('/login', adminLogin)
router.post('/', createAdmin)


export default router
