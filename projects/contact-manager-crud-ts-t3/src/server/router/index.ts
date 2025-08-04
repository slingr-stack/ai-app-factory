import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../utils/prisma';

const t = initTRPC.create();

export const appRouter = t.router({
  contact: t.router({
    getAll: t.procedure.query(async () => {
      return await prisma.contact.findMany();
    }),
    add: t.procedure.input(z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
    })).mutation(async ({ input }) => {
      return await prisma.contact.create({ data: input });
    }),
    delete: t.procedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ input }) => {
      return await prisma.contact.delete({ where: { id: input.id } });
    }),
  }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
