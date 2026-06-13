import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { configureCloudinary } from './config/cloudinary.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

configureCloudinary();

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      
      const isAllowed =
        origin === env.clientUrl ||
        origin.startsWith('http://localhost') ||
        origin.endsWith('.vercel.app');
        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(null, false); // Or pass error: callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
);
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});

if (env.storageMode === 'local') {
  app.use('/uploads', express.static(path.resolve(__dirname, env.uploadDir)));
}

app.use('/api/v1', apiRoutes);
app.use(errorHandler);

export default app;
