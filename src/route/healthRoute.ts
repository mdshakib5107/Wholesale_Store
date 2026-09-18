import express from 'express';
import { health } from '@/api/health'
const router = express.Router();
router.route('/')
  .get(health)
export default router;