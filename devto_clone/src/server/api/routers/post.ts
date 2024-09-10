import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ 
      name: z.string().min(1), 
      content: z.string().min(1),
      tags: z.array(z.string())
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          content: input.content,
          tags: input.tags,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { createdBy: true },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findUnique({
        where: { id: input.id },
        include: { createdBy: true },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.id },
      });

      if (!post || post.createdById !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      return ctx.db.post.delete({
        where: { id: input.id },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getUserPosts: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: { createdById: input.userId },
        orderBy: { createdAt: "desc" },
      });
    }),
});
