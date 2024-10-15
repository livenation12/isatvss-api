import express from "express"
import { getUsers, getUser, deleteUser } from "../controllers/userController.js"
const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUser)
router.delete('/:userId', deleteUser)
export default router