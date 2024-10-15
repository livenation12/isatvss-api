import express from 'express'
import {
          createRequest,
          userRequests,
          requests,
          updateRequest,
          getFilteredRequestByStatusAndDate,
          getRequestsByDate,
          approveRequest,
          returnRequest,
          requestGroupedByMonth,
          vehicleUsageCount
} from '../controllers/requestController.js';
import { checkDailyRequests } from '../middlewares/requestMiddleware.js';
import { adminAuth } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/', checkDailyRequests, createRequest)
router.get('/vehicle-usage', adminAuth, vehicleUsageCount)
router.get('/:userId', userRequests)
router.get('/', requests)
router.post('/status', getFilteredRequestByStatusAndDate)
router.patch('/:requestId/status/approve', adminAuth, approveRequest)
router.patch('/:requestId/status/return', adminAuth, returnRequest)
router.patch('/:requestId', adminAuth, updateRequest)
router.patch('/:requestId/status/cancel', updateRequest)
router.get('/date/:date', getRequestsByDate)
router.get('/monthly-count/:year', requestGroupedByMonth)
export default router