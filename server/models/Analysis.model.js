import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    atsScore: { type: Number, required: true, min: 0, max: 100 },
    missingSkills: [{ type: String }],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [{ type: String }],
    rawTextLength: { type: Number },
  },
  { timestamps: true }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

export const Analysis = mongoose.model('Analysis', analysisSchema);
