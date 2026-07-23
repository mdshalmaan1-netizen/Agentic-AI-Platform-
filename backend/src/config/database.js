import { PrismaClient } from '@prisma/client';
import config from './index.js';

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
  });
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__db;
}

export { prisma };
export default prisma;
