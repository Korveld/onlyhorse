"use server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/db/prisma";

export const checkAuthStatus = async () => {
  const {getUser} = getKindeServerSession()
  const user = await getUser();

  if (!user) {
    return {success: false};
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id }
  }).finally(() => {
    prisma.$disconnect();
  });

  // sign up
  if (!existingUser) {
    if (user.family_name) {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.given_name + " " + user.family_name,
          image: user.picture,
        }
      }).finally(() => {
        prisma.$disconnect();
      });
    } else {
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.given_name || "",
          image: user.picture,
        }
      }).finally(() => {
        prisma.$disconnect();
      });
    }
  }

  return {success: true};
}
