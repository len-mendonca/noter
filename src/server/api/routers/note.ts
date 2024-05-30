import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const noteRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        topicId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const note = await ctx.db.note.create({
          data: {
            content: input.content,
            title: input.title,
            topicId: input.topicId,
          },
        });
        return note;
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
        const note = await ctx.db.note.delete({
          where: {
            id: input.id,
          },
        });
        return note;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create",
        });
      }
    }),
  getAll: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.note.findMany({
        where: {
          topicId: input.topicId,
        },
      });
    }),
});
