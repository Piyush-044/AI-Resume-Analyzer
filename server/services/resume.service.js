import fs from 'fs/promises';
import path from 'path';
import { Resume } from '../models/Resume.model.js';
import { Analysis } from '../models/Analysis.model.js';
import { JobMatch } from '../models/JobMatch.model.js';
import { cloudinary } from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { pdfService } from './pdf.service.js';

export const resumeService = {
  async createFromUpload(userId, file) {
    let fileUrl;
    let filePublicId;
    let storageType = env.storageMode === 'cloudinary' ? 'cloudinary' : 'local';

    if (storageType === 'cloudinary' && file.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'raw', folder: 'resumes', format: 'pdf' },
          (err, res) => (err ? reject(err) : resolve(res))
        );
        stream.end(file.buffer);
      });
      fileUrl = result.secure_url;
      filePublicId = result.public_id;
    } else {
      fileUrl = path.join(env.uploadDir, file.filename).replace(/\\/g, '/');
      storageType = 'local';
    }

    let extractedText = '';
    try {
      if (file.buffer) {
        extractedText = await pdfService.extractFromBuffer(file.buffer);
      } else if (file.path) {
        const buffer = await fs.readFile(file.path);
        extractedText = await pdfService.extractFromBuffer(buffer);
      }
    } catch (err) {
      console.warn('Failed to extract text during upload, will fall back on analysis:', err.message);
    }

    return Resume.create({
      userId,
      fileName: file.originalname,
      fileUrl,
      filePublicId,
      storageType,
      fileSize: file.size,
      mimeType: file.mimetype,
      extractedText,
    });
  },

  async listByUser(userId, limit = 20) {
    return Resume.find({ userId }).sort({ uploadedAt: -1 }).limit(limit);
  },

  async getByIdForUser(resumeId, userId) {
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) throw new ApiError(404, 'Resume not found');
    return resume;
  },

  async delete(resumeId, userId) {
    const resume = await this.getByIdForUser(resumeId, userId);

    if (resume.storageType === 'cloudinary' && resume.filePublicId) {
      await cloudinary.uploader.destroy(resume.filePublicId, { resource_type: 'raw' });
    } else if (resume.storageType === 'local') {
      const filePath = path.isAbsolute(resume.fileUrl)
        ? resume.fileUrl
        : path.join(process.cwd(), resume.fileUrl);
      try {
        await fs.unlink(filePath);
      } catch {
        /* file may already be gone */
      }
    }

    await Analysis.deleteMany({ resumeId });
    await JobMatch.deleteMany({ resumeId });
    await Resume.deleteOne({ _id: resumeId });
    return { deleted: true };
  },
};
