import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';

const maxSize = env.maxFileSizeMb * 1024 * 1024;

if (env.storageMode === 'local' && !fs.existsSync(env.uploadDir)) {
  fs.mkdirSync(env.uploadDir, { recursive: true });
}

const storage =
  env.storageMode === 'local'
    ? multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, env.uploadDir),
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${path.extname(file.originalname)}`);
        },
      })
    : multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const uploadPdf = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});
