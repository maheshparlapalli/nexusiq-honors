import express from 'express';
import { createTemplate, updateTemplate, getTemplate, listTemplates, previewTemplate } from '../controllers/templates.controller.js';
const router = express.Router();
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.get('/:id', getTemplate);
router.get('/', listTemplates);
router.post('/:id/preview', previewTemplate);
export default router;
