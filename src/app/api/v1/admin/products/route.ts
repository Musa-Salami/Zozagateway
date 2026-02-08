import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import type { PaginatedResponse, Product } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

async function generateUniqueSlug(name: string): Promise<string> {
  let slug = slugify(name);
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
    });

    if (!existing) {
      return candidate;
    }
    suffix++;
  }
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

    // Filtering
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const published = searchParams.get("published");

    const where: Record<string, unknown> = {};

    if (category) {
      where.categoryId = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: { position: "asc" },
          },
          _count: {
            select: { orderItems: true },
          },
        },
        orderBy: { createdAt: "desc" },
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
    console.error("Error fetching admin products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.role || token.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Separate images from the product data
    const { images, ...productData } = body;

    const parsed = productSchema.safeParse(productData);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Auto-generate slug from name
    const slug = await generateUniqueSlug(data.name);

    // Create product with associated images
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice || null,
        categoryId: data.categoryId,
        stock: data.stock,
        sku: data.sku || null,
        tags: data.tags,
        dietary: data.dietary,
        published: data.published,
        featured: data.featured,
        images:
          images && Array.isArray(images) && images.length > 0
            ? {
                create: images.map(
                  (
                    img: { url: string; publicId: string },
                    index: number
                  ) => ({
                    url: img.url,
                    publicId: img.publicId,
                    position: index,
                  })
                ),
              }
            : undefined,
      },
      include: {
        category: true,
        images: {
          orderBy: { position: "asc" },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
