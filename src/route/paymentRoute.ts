import express from 'express';
import { paymentApi } from '@/api/payments/index'
const router = express.Router();
router.route('/')
  .post(paymentApi.payment)
router.route('/deposits')
  .post(paymentApi.deposits)
router.route('/supplier-payment')
  .post(paymentApi.supplierPayment)
export default router;
