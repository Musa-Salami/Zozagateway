import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validators";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import type { PaginatedResponse, Order } from "@/types";
import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const createOrderSchema = orderSchema.extend({
  items: z.array(cartItemSchema).min(1, "Order must have at least one item"),
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ZG-${timestamp}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );
    const skip = (page - 1) * limit;

    const where = { userId: token.userId };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { position: "asc" },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Order> = {
      data: orders as unknown as Order[],
      total,
      page,
      limit,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, deliveryType, address, city, phone, notes, promoCode } =
      parsed.data;

    // Fetch product details and validate stock
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, published: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all products exist and have sufficient stock
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found or unavailable` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    // Calculate delivery fee
    const deliveryFee =
      deliveryType === "DELIVERY" && subtotal < FREE_DELIVERY_THRESHOLD
        ? DELIVERY_FEE
        : 0;

    // Apply promo code discount
    let discount = 0;
    if (promoCode) {
      const promo = await prisma.promoCode.findUnique({
        where: { code: promoCode.toUpperCase() },
      });

      if (
        promo &&
        promo.active &&
        (!promo.expiresAt || promo.expiresAt > new Date()) &&
        (!promo.maxUses || promo.usedCount < promo.maxUses)
      ) {
        if (
          !promo.minOrder ||
          subtotal >= Number(promo.minOrder)
        ) {
          if (promo.discountType === "percentage") {
            discount = subtotal * (Number(promo.discountValue) / 100);
          } else {
            discount = Number(promo.discountValue);
          }

          // Update promo usage count
          await prisma.promoCode.update({
            where: { id: promo.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const total = subtotal + deliveryFee - discount;
    const orderNumber = generateOrderNumber();

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: token.userId,
          status: "PENDING",
          subtotal,
          deliveryFee,
          discount,
          total,
          paymentStatus: "PENDING",
          deliveryType,
          address: address || null,
          city: city || null,
          phone,
          notes: notes || null,
          promoCode: promoCode?.toUpperCase() || null,
          items: {
            create: orderItems,
          },
          timeline: {
            create: {
              status: "PENDING",
              note: "Order placed",
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          timeline: true,
        },
      });

      // Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
