import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

export const configureCloudinary = () => {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    return true;
  }
  return false;
};

export { cloudinary };
