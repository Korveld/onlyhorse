"use server";

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/db/prisma";
import {id} from "postcss-selector-parser";
import {centsToDollars} from "@/lib/utils";

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

export async function getDashboardDataAction() {
  const totalRevenuePromise = Promise.all([
    prisma.order.aggregate({
      _sum: {
        price: true
      }
    }),
    prisma.subscription.aggregate({
      _sum: {
        price: true
      }
    })
  ]);

  const totalSalesPromise = prisma.order.count();
  const totalSubscriptionsPromise = prisma.subscription.count();

  const recentSalesPromise = prisma.order.findMany({
    take: 4,
    orderBy: {
      orderDate: 'desc'
    },
    select: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        }
      },
      price: true,
      orderDate: true,
    }
  });

  const recentSubscriptionsPromise = prisma.subscription.findMany({
    take: 4,
    orderBy: {
      startDate: 'desc'
    },
    select: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        }
      },
      // planId: true,
      price: true,
      startDate: true,
    }
  });

  // run all promises in parallel so that they don't block each other
  const [
    totalRevenueResult,
    totalSales,
    totalSubscriptions,
    recentSales,
    recentSubscriptions
  ] = await Promise.all([
    totalRevenuePromise,
    totalSalesPromise,
    totalSubscriptionsPromise,
    recentSalesPromise,
    recentSubscriptionsPromise
  ]);

  const totalRevenue = (totalRevenueResult[0]._sum.price || 0) + (totalRevenueResult[1]._sum.price || 0);

  return {
    totalRevenue: centsToDollars(totalRevenue),
    totalSales,
    totalSubscriptions,
    recentSales,
    recentSubscriptions
  }
}
