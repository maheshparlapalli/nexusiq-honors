import express from 'express';
import multer from 'multer';
import { uploadBuffer, getSignedUrl, deleteObject } from '../services/s3.service.js';
import crypto from 'crypto';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type. Please upload PNG, JPG, or WebP' });
    }

    const folder = req.body.folder || 'uploads';
    const ext = req.file.originalname.split('.').pop();
    const filename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
    const key = `${folder}/${filename}`;

    await uploadBuffer(req.file.buffer, key, req.file.mimetype);
    
    const url = getSignedUrl(key, 3600);

    res.json({ 
      success: true, 
      key,
      url,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({ message: 'No file key provided' });
    }

    await deleteObject(key);
    
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

router.post('/refresh-url', async (req, res) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({ message: 'No file key provided' });
    }

    const url = getSignedUrl(key, 3600);
    
    res.json({ success: true, url });
  } catch (error) {
    console.error('Refresh URL error:', error);
    res.status(500).json({ message: 'Failed to refresh URL' });
  }
});

export default router;
