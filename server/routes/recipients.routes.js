import express from 'express';
import { createRecipient, getRecipientByEmail } from '../controllers/recipients.controller.js';
const router = express.Router();
router.post('/', createRecipient);
router.get('/:email', getRecipientByEmail);
export default router;
