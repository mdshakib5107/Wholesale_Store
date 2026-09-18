import express from 'express';
import { ordersApi } from '@/api/orders/index'
const router = express.Router();
router.route('/')
  .post(ordersApi.placeOrder)
export default router;