import express from 'express';
import healthRoute from './healthRoute'
import userRoute from './userRoute'
import orderRoute from './orderRoute'
import productRoute from './productRoute'
import supplierSlipRoute from './supplierSlipRoute'
import paymentRoute from './paymentRoute'
const router = express.Router();
router.use('/health', healthRoute)
router.use('/users', userRoute)
router.use('/orders', orderRoute)
router.use('/products', productRoute)
router.use('/supplierSlips', supplierSlipRoute)
router.use('/payments', paymentRoute)
export default router;