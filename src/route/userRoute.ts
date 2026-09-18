import express from 'express';
import { stakeholderApi } from '@/api/stakeholder/index'
const router = express.Router();
router.route('/')
  .get(stakeholderApi.getUsers)
export default router;