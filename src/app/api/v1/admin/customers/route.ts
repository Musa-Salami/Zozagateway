import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import type { PaginatedResponse } from "@/types";

interface CustomerWithStats {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
  createdAt: Date;
  _count: {
    orders: number;
  };
  totalSpent: number;
}

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

    // Search
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      role: "CUSTOMER",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatar: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
          orders: {
            where: {
              status: { notIn: ["CANCELLED"] },
            },
            select: {
              total: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Calculate total spent for each customer
    const customers: CustomerWithStats[] = users.map((user) => {
      const totalSpent = user.orders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      );

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
        _count: user._count,
        totalSpent: Math.round(totalSpent * 100) / 100,
      };
    });

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<CustomerWithStats> = {
      data: customers,
      total,
      page,
      limit,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
