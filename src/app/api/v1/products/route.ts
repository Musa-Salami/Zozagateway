import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PaginatedResponse, Product } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "12", 10))
    );
    const skip = (page - 1) * limit;

    // Filtering
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const dietary = searchParams.get("dietary");
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Sorting
    const sort = searchParams.get("sort");

    // Build where clause — only published products for public endpoint
    const where: Record<string, unknown> = {
      published: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search.toLowerCase()] } },
      ];
    }

    if (dietary) {
      const dietaryFilters = dietary.split(",").map((d) => d.trim());
      where.dietary = { hasSome: dietaryFilters };
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
      }
    }

    // Build orderBy
    let orderBy: Record<string, string> | Record<string, string>[] = {
      createdAt: "desc",
    };

    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
        break;
    }

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { position: "asc" },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Product> = {
      data: products as unknown as Product[],
      total,
      page,
      limit,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
