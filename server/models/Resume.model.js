import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String },
    storageType: { type: String, enum: ['local', 'cloudinary'], default: 'local' },
    fileSize: { type: Number },
    mimeType: { type: String, default: 'application/pdf' },
    extractedText: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, uploadedAt: -1 });

export const Resume = mongoose.model('Resume', resumeSchema);
