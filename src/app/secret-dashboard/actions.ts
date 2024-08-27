"use server";

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/db/prisma";
import {id} from "postcss-selector-parser";

export type TCreatePostAction = {
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  isPublic: boolean;
}

export type TAddNewProductToStoreAction = {
  name: string;
  image: string;
  price: string | number;
}

async function checkIfAdmin() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  if (!user || !isAdmin) return false;

  return user;
}

export async function createPostAction({
  isPublic,
  mediaUrl,
  mediaType,
  text,
}: TCreatePostAction) {
  const admin = await checkIfAdmin();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  if (!text) {
    throw new Error("Content is required");
  }

  if (!mediaUrl) {
    throw new Error("Media URL is required");
  }

  const newPost = await prisma.post.create({
    data: {
      text,
      mediaType,
      mediaUrl,
      isPublic,
      userId: admin.id,
    }
  });

  return {
    success: true,
    post: newPost
  }
}

export async function getAllProductsAction() {
  const isAdmin = await checkIfAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const products = await prisma.product.findMany({
    orderBy: [
      {
        name: 'desc',
      }
    ]
  });

  return products;
}

export async function getLiveProductsAction() {
  const products = await prisma.product.findMany({
    where: {
      isArchived: false,
    },
    orderBy: [
      {
        name: 'desc',
      }
    ]
  });

  return products;
}

export async function addNewProductToStoreAction({
  name,
  image,
  price
}: TAddNewProductToStoreAction) {
  const isAdmin = await checkIfAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  if (!name || !image || !price) {
    throw new Error("Please provide all required fields");
  }

  const priceInCents = Math.round(parseFloat(String(price)) * 100);

  if (isNaN(priceInCents)) {
    throw new Error("Price must be a number");
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      price: priceInCents,
      image,
    }
  });

  return {
    success: true,
    product: newProduct,
  }
}

export async function toggleProductArchiveAction(productId: string) {
  const isAdmin = await checkIfAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new Error("Product not found");
  }

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      isArchived: !product.isArchived
    }
  });

  return { success: true, product: updatedProduct };
}
