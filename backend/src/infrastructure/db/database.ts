import { PrismaClient } from '@prisma/client';

// Keep a single instance of PrismaClient to prevent connection exhaustion.
export const prisma = new PrismaClient();
