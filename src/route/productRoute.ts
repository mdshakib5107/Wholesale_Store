import express from 'express';
import { productApi } from '@/api/products/index'
const router = express.Router();
router.route('/')
  .post(productApi.createProduct)
export default router;