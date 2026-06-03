import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large' });
  }
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.name === 'GoogleGenerativeAIFetchError') {
    const message =
      err.status === 404
        ? 'AI model not available. Restart server after updating GEMINI_MODEL in .env'
        : err.message;
    return res.status(502).json({ success: false, message });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
};
