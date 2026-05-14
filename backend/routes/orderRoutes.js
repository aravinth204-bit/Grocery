import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getAnalytics
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, authorize('admin'), getOrders);
router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, authorize('admin'), deleteOrder);
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

export default router;
