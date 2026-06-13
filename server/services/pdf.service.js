import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const pdfService = {
  async extractFromBuffer(buffer) {
    const data = await pdf(buffer);
    if (!data.text?.trim()) {
      throw new ApiError(400, 'Could not extract text from PDF');
    }
    return data.text;
  },

  async extractFromResume(resume) {
    if (resume.extractedText) {
      return resume.extractedText;
    }

    if (resume.storageType === 'local') {
      const filePath = path.isAbsolute(resume.fileUrl)
        ? resume.fileUrl
        : path.join(process.cwd(), resume.fileUrl);
      const buffer = await fs.readFile(filePath);
      return this.extractFromBuffer(buffer);
    }
    const response = await fetch(resume.fileUrl);
    if (!response.ok) throw new ApiError(400, 'Failed to fetch resume PDF');
    const buffer = Buffer.from(await response.arrayBuffer());
    return this.extractFromBuffer(buffer);
  },

  getLocalPath(filename) {
    return path.join(env.uploadDir, filename);
  },
};
