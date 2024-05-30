import { LoginSchema, RegisterSchema } from "~/server/schemas/zod-schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "~/utils/auth";
import { signIn } from "next-auth/react";

export const loginRouter = createTRPCRouter({
  signup: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user ?? ctx.session) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are logged in",
        });
      }
      const { name, email, password } = input;
      try {
        const getExistingUser = await getUserByEmail(email);
        if (getExistingUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Account already exists",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        return {
          status: "success",
          message: "user created",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  signIn: publicProcedure.input(LoginSchema).mutation(async ({ input }) => {
    const { email, password } = input;
    const getExistingUser = await getUserByEmail(email);

    if (!getExistingUser?.email || !getExistingUser?.password) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid credentials",
      });
    }
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/home",
      });
    } catch (error) {
      console.log(error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  getUsers: protectedProcedure.query(async () => {
    return await db.user.findMany();
  }),
});
