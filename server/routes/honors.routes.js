import express from 'express';
import { issueHonor, regenerateHonor, publicView, downloadHonor, myHonors, listHonors, revokeHonor } from '../controllers/honors.controller.js';
const router = express.Router();
router.post('/issue', issueHonor);
router.post('/:id/regenerate', regenerateHonor);
router.get('/public/:slug', publicView);
router.get('/:id/download', downloadHonor);
router.get('/me', myHonors);
// admin
router.get('/', listHonors);
router.post('/:id/revoke', revokeHonor);
export default router;
