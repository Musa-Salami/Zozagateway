import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { PaginatedResponse, Order, OrderStatus } from "@/types";

const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "PICKED_UP",
    "CANCELLED",
  ]),
  note: z.string().optional(),
});

// Valid status transitions
const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["DELIVERED", "PICKED_UP", "CANCELLED"],
  DELIVERED: [],
  PICKED_UP: [],
  CANCELLED: [],
};

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.role || token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );
    const skip = (page - 1) * limit;

    // Filters
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        (where.createdAt as Record<string, unknown>).gte = new Date(dateFrom);
      }
      if (dateTo) {
        (where.createdAt as Record<string, unknown>).lte = new Date(dateTo);
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
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
    console.error("Error fetching admin orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.role || token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, status: newStatus, note } = parsed.data;

    // Fetch current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Validate status transition
    const allowedTransitions =
      STATUS_TRANSITIONS[currentOrder.status] || [];

    if (!allowedTransitions.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${currentOrder.status} to ${newStatus}. Allowed: ${allowedTransitions.join(", ") || "none"}`,
        },
        { status: 400 }
      );
    }

    // Update order and create timeline entry in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus as OrderStatus },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
          timeline: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      // Create timeline entry
      await tx.orderTimeline.create({
        data: {
          orderId,
          status: newStatus as OrderStatus,
          note: note || `Status updated to ${newStatus}`,
          changedBy: token.userId,
        },
      });

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
