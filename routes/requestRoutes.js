import express from 'express'
import { createRequest, userRequests, requests, updateRequest } from '../controllers/requestController.js';
import { checkDailyRequests } from '../middlewares/requestMiddleware.js';
import { adminAuth } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/', checkDailyRequests, createRequest)
router.get('/:userId', userRequests)
router.get('/', requests)
router.patch('/:requestId', adminAuth, updateRequest)

export default router