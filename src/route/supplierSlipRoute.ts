import express from 'express'
import { slipsApi } from '@/api/supplierSlips/index';
//console.log(slipsApi);
const router = express.Router();
router.route("/")
  .get(slipsApi.getSlipItem)
  .post(slipsApi.prepareSlip)
export default router;
