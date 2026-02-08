import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

function getPeriodDates(period: string): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  const end = new Date();
  const start = new Date();
  const prevEnd = new Date();
  const prevStart = new Date();

  switch (period) {
    case "7d":
      start.setDate(end.getDate() - 7);
      prevEnd.setDate(start.getDate());
      prevStart.setDate(prevEnd.getDate() - 7);
      break;
    case "30d":
      start.setDate(end.getDate() - 30);
      prevEnd.setDate(start.getDate());
      prevStart.setDate(prevEnd.getDate() - 30);
      break;
    case "90d":
      start.setDate(end.getDate() - 90);
      prevEnd.setDate(start.getDate());
      prevStart.setDate(prevEnd.getDate() - 90);
      break;
    case "12m":
      start.setMonth(end.getMonth() - 12);
      prevEnd.setTime(start.getTime());
      prevStart.setMonth(prevEnd.getMonth() - 12);
      break;
    default:
      start.setDate(end.getDate() - 30);
      prevEnd.setDate(start.getDate());
      prevStart.setDate(prevEnd.getDate() - 30);
  }

  return { start, end, prevStart, prevEnd };
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
    const period = searchParams.get("period") || "30d";
    const { start, end, prevStart, prevEnd } = getPeriodDates(period);

    // Execute all analytics queries in parallel
    const [
      currentPeriodOrders,
      previousPeriodOrders,
      revenueByDay,
      topProducts,
      salesByCategory,
    ] = await Promise.all([
      // Current period aggregates
      prisma.order.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
          status: { notIn: ["CANCELLED"] },
        },
        _sum: { total: true },
        _count: true,
        _avg: { total: true },
      }),

      // Previous period aggregates (for comparison)
      prisma.order.aggregate({
        where: {
          createdAt: { gte: prevStart, lte: prevEnd },
          status: { notIn: ["CANCELLED"] },
        },
        _sum: { total: true },
        _count: true,
        _avg: { total: true },
      }),

      // Revenue by day (for line chart)
      prisma.order.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: { gte: start, lte: end },
          status: { notIn: ["CANCELLED"] },
        },
        _sum: { total: true },
        _count: true,
        orderBy: { createdAt: "asc" },
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ["productId"],
        where: {
          order: {
            createdAt: { gte: start, lte: end },
            status: { notIn: ["CANCELLED"] },
          },
        },
        _sum: {
          quantity: true,
          totalPrice: true,
        },
        orderBy: {
          _sum: { totalPrice: "desc" },
        },
        take: 10,
      }),

      // Sales by category
      prisma.orderItem.findMany({
        where: {
          order: {
            createdAt: { gte: start, lte: end },
            status: { notIn: ["CANCELLED"] },
          },
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      }),
    ]);

    // Calculate current period metrics
    const totalRevenue = Number(currentPeriodOrders._sum.total || 0);
    const orderCount = currentPeriodOrders._count;
    const avgOrderValue = Number(currentPeriodOrders._avg.total || 0);

    // Calculate previous period metrics
    const prevRevenue = Number(previousPeriodOrders._sum.total || 0);
    const prevOrderCount = previousPeriodOrders._count;
    const prevAvgOrderValue = Number(previousPeriodOrders._avg.total || 0);

    // Calculate percentage changes
    const revenueChange =
      prevRevenue > 0
        ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
        : totalRevenue > 0
          ? 100
          : 0;

    const orderCountChange =
      prevOrderCount > 0
        ? ((orderCount - prevOrderCount) / prevOrderCount) * 100
        : orderCount > 0
          ? 100
          : 0;

    const avgOrderValueChange =
      prevAvgOrderValue > 0
        ? ((avgOrderValue - prevAvgOrderValue) / prevAvgOrderValue) * 100
        : avgOrderValue > 0
          ? 100
          : 0;

    // Aggregate revenue by day
    const dailyRevenueMap = new Map<string, { revenue: number; orders: number }>();

    for (const entry of revenueByDay) {
      const dateKey = new Date(entry.createdAt).toISOString().split("T")[0];
      const existing = dailyRevenueMap.get(dateKey) || {
        revenue: 0,
        orders: 0,
      };
      existing.revenue += Number(entry._sum.total || 0);
      existing.orders += entry._count;
      dailyRevenueMap.set(dateKey, existing);
    }

    const revenueByDayArray = Array.from(dailyRevenueMap.entries()).map(
      ([date, data]) => ({
        date,
        revenue: Math.round(data.revenue * 100) / 100,
        orders: data.orders,
      })
    );

    // Enrich top products with names
    const topProductIds = topProducts.map((p) => p.productId);
    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true },
    });
    const productNameMap = new Map(productDetails.map((p) => [p.id, p.name]));

    const topSellingProducts = topProducts.map((p) => ({
      name: productNameMap.get(p.productId) || "Unknown",
      quantity: p._sum.quantity || 0,
      revenue: Math.round(Number(p._sum.totalPrice || 0) * 100) / 100,
    }));

    // Aggregate sales by category
    const categoryMap = new Map<
      string,
      { name: string; revenue: number; quantity: number }
    >();

    for (const item of salesByCategory) {
      const categoryName = item.product.category?.name || "Uncategorized";
      const existing = categoryMap.get(categoryName) || {
        name: categoryName,
        revenue: 0,
        quantity: 0,
      };
      existing.revenue += Number(item.totalPrice);
      existing.quantity += item.quantity;
      categoryMap.set(categoryName, existing);
    }

    const salesByCategoryArray = Array.from(categoryMap.values())
      .map((cat) => ({
        ...cat,
        revenue: Math.round(cat.revenue * 100) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      period,
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        orderCount,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        revenueChange: Math.round(revenueChange * 10) / 10,
        orderCountChange: Math.round(orderCountChange * 10) / 10,
        avgOrderValueChange: Math.round(avgOrderValueChange * 10) / 10,
      },
      revenueByDay: revenueByDayArray,
      topSellingProducts,
      salesByCategory: salesByCategoryArray,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
