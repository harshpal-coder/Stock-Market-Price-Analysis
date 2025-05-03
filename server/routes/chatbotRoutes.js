import express from 'express';
import { chatWithStock } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/chat', chatWithStock);

export default router;
