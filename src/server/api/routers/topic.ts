import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const topicRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { title } = input;

      try {
        await ctx.db.topic.create({
          data: {
            userId: ctx.session.user.id,
            title,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create",
        });
      }
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const topics = await ctx.db.topic.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return topics;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create",
      });
    }
  }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.note.deleteMany({
          where: {
            topicId: input.id,
          },
        });

        const topic = await ctx.db.topic.delete({
          where: {
            id: input.id,
          },
        });
        return topic;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create",
        });
      }
    }),
});
