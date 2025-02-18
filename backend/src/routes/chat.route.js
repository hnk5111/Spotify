import express from 'express';
import { chatWithAI } from '../controller/chat.controller.js';

const router = express.Router();

router.post('/', chatWithAI);

export default router; 