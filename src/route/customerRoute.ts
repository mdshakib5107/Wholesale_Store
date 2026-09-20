import express from 'express';
import { customersApi } from '@/api/stakeholder/customers/index'
const router = express.Router();
router.route('/:customerId/orders')
  .get(customersApi.getOrdersByCustomerId)
router.route('/')
  .get(customersApi.getAllCustomers)
router.route('/:customerId/')
  .get(customersApi.findCustomer)
export default router;