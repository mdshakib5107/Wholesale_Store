import express from 'express';
import { paymentApi } from '@/api/payments/index'
const router = express.Router();
router.route('/')
  .post(paymentApi.payment)
export default router;
