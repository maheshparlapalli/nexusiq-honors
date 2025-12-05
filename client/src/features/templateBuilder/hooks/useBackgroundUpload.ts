import { useState, useRef } from 'react';
import axios from 'axios';

interface UseBackgroundUploadReturn {
  uploading: boolean;
  removing: boolean;
  backgroundFilename: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, onSuccess: (url: string, key: string, filename: string) => void, onError: (message: string) => void) => Promise<void>;
  handleRemoveBackground: (key: string, onComplete: () => void) => Promise<void>;
  setBackgroundFilename: (filename: string) => void;
}

export function useBackgroundUpload(): UseBackgroundUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [backgroundFilename, setBackgroundFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string, key: string, filename: string) => void,
    onError: (message: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onError('Please upload a PNG, JPG, or WebP image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'templates/backgrounds');

      const response = await axios.post('/api/v1/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const filename = response.data.filename || file.name;
      setBackgroundFilename(filename);
      onSuccess(response.data.url, response.data.key, filename);
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveBackground(key: string, onComplete: () => void) {
    if (key) {
      setRemoving(true);
      try {
        await axios.delete('/api/v1/upload', { data: { key } });
      } catch (err) {
        console.error('Failed to delete from S3:', err);
      } finally {
        setRemoving(false);
      }
    }
    setBackgroundFilename('');
    onComplete();
  }

  return {
    uploading,
    removing,
    backgroundFilename,
    fileInputRef,
    handleFileUpload,
    handleRemoveBackground,
    setBackgroundFilename
  };
}
