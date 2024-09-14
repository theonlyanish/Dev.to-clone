import { TRPCError } from "@trpc/server";
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
      tags: z.array(z.string()),
      coverImageUrl: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          name: input.name,
          content: input.content,
          tags: input.tags,
          coverImageUrl: input.coverImageUrl,
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
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authorized' });
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

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          name: {
            contains: input.query,
            mode: 'insensitive',
          },
        },
        include: { createdBy: true },
        orderBy: { createdAt: 'desc' },
      });
      return posts;
    }),
});