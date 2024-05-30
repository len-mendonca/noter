import { db } from "~/server/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) return null;
    return user;
  } catch (error) {
    throw error;
  }
};
