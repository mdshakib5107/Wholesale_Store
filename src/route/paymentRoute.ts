import express from 'express';
import { paymentApi } from '@/api/payments/index'
const router = express.Router();
router.route('/')
  .post(paymentApi.payment)
router.route('/deposits')
  .post(paymentApi.deposits)
export default router;
