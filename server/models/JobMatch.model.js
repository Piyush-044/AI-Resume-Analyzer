import mongoose from 'mongoose';

const jobMatchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    jobDescription: { type: String, required: true, maxlength: 15000 },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    missingSkills: [{ type: String }],
    recommendedSkills: [{ type: String }],
  },
  { timestamps: true }
);

jobMatchSchema.index({ userId: 1, createdAt: -1 });

export const JobMatch = mongoose.model('JobMatch', jobMatchSchema);
