"use server";

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/db/prisma";

export async function getPostsAction() {
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const posts = await prisma.post.findMany({
    include: {
      comments: {
        include: {
          user: true
        }
      },
      likesList: { where: { userId: user.id } }
    },
    orderBy: [
      {
        createdAt: 'desc'
      }
    ]
  }).finally(() => {
    prisma.$disconnect();
  });

  return posts;
}

export async function deletePostAction(postId: string) {
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId }
  }).finally(() => {
    prisma.$disconnect();
  });

  if (post?.userId !== user.id) {
    throw new Error("Only admin can delete posts");
  }

  await prisma.post.delete({
    where: { id: postId }
  }).finally(() => {
    prisma.$disconnect();
  });

  return { success: true };
}

export async function likePostAction(postId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const userProfile = await prisma.user.findUnique({
    where: { id: user.id }
  }).finally(() => {
    prisma.$disconnect();
  });
  if (!userProfile?.isSubscribed) return;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { likes: true, likesList: { where: { userId: user.id } } },
  }).finally(() => {
    prisma.$disconnect();
  });

  if (!post) throw new Error("Post not found");

  let newLikes: number;
  if (post.likesList.length > 0) {
    newLikes = Math.max(post.likes - 1, 0);
    await prisma.like.deleteMany({
      where: { postId: postId, userId: user.id },
    }).finally(() => {
      prisma.$disconnect();
    });
  } else {
    newLikes = post.likes + 1;
    await prisma.like.create({
      data: { postId: postId, userId: user.id },
    }).finally(() => {
      prisma.$disconnect();
    });
  }

  await prisma.post.update({
    where: { id: postId },
    data: { likes: newLikes },
  }).finally(() => {
    prisma.$disconnect();
  });

  return { success: true };
}

export async function commentOnPostAction(postId: string, text: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const userProfile = await prisma.user.findUnique({
    where: { id: user.id }
  }).finally(() => {
    prisma.$disconnect();
  });
  if (!userProfile?.isSubscribed) return;

  const comment = await prisma.comment.create({
    data: {
      text,
      postId,
      userId: user.id,
    },
  }).finally(() => {
    prisma.$disconnect();
  });

  return { success: true };
}
