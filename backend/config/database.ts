import mongoose from 'mongoose';
import { logger } from './logger.js';

export async function connectDB(): Promise<void> {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ladelicieuse';
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    logger.info(`MongoDB connecté : ${mongoose.connection.host}`);
  } catch (error) {
    logger.error('Échec de connexion MongoDB', { message: (error as Error).message });
    logger.warn('Le serveur démarre sans MongoDB — routes base de données indisponibles.');
  }
}

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB déconnecté');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnecté');
});

export default mongoose;
