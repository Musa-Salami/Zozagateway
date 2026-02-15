import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

const validateCartSchema = z.object({
  items: z.array(cartItemSchema).min(1, "Cart must have at least one item"),
});

export async function GET() {
  try {
    // Placeholder: return empty cart structure for future server-side cart
    return NextResponse.json({
      items: [],
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
      itemCount: 0,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = validateCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items } = parsed.data;
    const productIds = items.map((item) => item.productId);

    // Fetch all products to validate stock
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        published: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const errors: string[] = [];
    const validatedItems: Array<{
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      available: boolean;
    }> = [];

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        errors.push(`Product ${item.productId} not found or unavailable`);
        continue;
      }

      const available = product.stock >= item.quantity;

      if (!available) {
        errors.push(
          `${product.name}: only ${product.stock} in stock (requested ${item.quantity})`
        );
      }

      validatedItems.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: Number(product.price),
        totalPrice: Number(product.price) * item.quantity,
        available,
      });
    }

    const allAvailable = errors.length === 0;

    return NextResponse.json({
      valid: allAvailable,
      items: validatedItems,
      errors,
    });
  } catch (error) {
    console.error("Error validating cart:", error);
    return NextResponse.json(
      { error: "Failed to validate cart" },
      { status: 500 }
    );
  }
}
