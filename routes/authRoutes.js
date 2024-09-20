import express from "express"
import { create, login, logout, sendInvite, verifyUserToken, verifyInviteToken } from "../controllers/authController.js"
import { requireInviteToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get('/verify', verifyUserToken)

router.post('/verify-invite', verifyInviteToken)

router.post('/login', login)

router.post('/', requireInviteToken, create)

router.get('/logout', logout)

router.post('/invite', sendInvite)

export default router