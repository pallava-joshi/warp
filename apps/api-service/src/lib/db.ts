import { type PrismaClient, prisma } from "@repo/prisma";

export const db: PrismaClient = prisma;
