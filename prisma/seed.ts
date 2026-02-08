import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin User
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@zozagateway.com" },
    update: {},
    create: {
      email: "admin@zozagateway.com",
      passwordHash: adminPassword,
      name: "Admin User",
      phone: "+1234567890",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create Customer User
  const customerPassword = await bcrypt.hash("Customer@123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: customerPassword,
      name: "Jane Customer",
      phone: "+1987654321",
      role: "CUSTOMER",
    },
  });
  console.log(`✅ Customer user created: ${customer.email}`);

  // Create Categories
  const categories = [
    { name: "Chips & Crisps", slug: "chips-crisps", sortOrder: 1 },
    { name: "Cookies & Biscuits", slug: "cookies-biscuits", sortOrder: 2 },
    { name: "Pastries & Pies", slug: "pastries-pies", sortOrder: 3 },
    { name: "Nuts & Trail Mix", slug: "nuts-trail-mix", sortOrder: 4 },
    { name: "Candy & Sweets", slug: "candy-sweets", sortOrder: 5 },
    { name: "Popcorn", slug: "popcorn", sortOrder: 6 },
    { name: "Healthy Snacks", slug: "healthy-snacks", sortOrder: 7 },
    { name: "Beverages", slug: "beverages", sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // Fetch created categories
  const allCategories = await prisma.category.findMany();
  const catMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.id]));

  // Create Products
  const products = [
    {
      name: "Classic Salted Chips",
      slug: "classic-salted-chips",
      description: "Perfectly crispy and lightly salted potato chips made from premium potatoes. A timeless snack favorite.",
      price: 3.99,
      comparePrice: 5.99,
      categoryId: catMap["chips-crisps"],
      stock: 150,
      tags: ["popular", "classic"],
      dietary: [],
      published: true,
      featured: true,
    },
    {
      name: "BBQ Kettle Chips",
      slug: "bbq-kettle-chips",
      description: "Thick-cut kettle-style chips with a smoky barbecue seasoning. Extra crunchy and flavorful.",
      price: 4.49,
      categoryId: catMap["chips-crisps"],
      stock: 120,
      tags: ["spicy", "kettle"],
      dietary: ["Vegan"],
      published: true,
      featured: false,
    },
    {
      name: "Double Chocolate Cookies",
      slug: "double-chocolate-cookies",
      description: "Rich, chewy cookies loaded with dark and white chocolate chips. Baked fresh daily.",
      price: 6.99,
      categoryId: catMap["cookies-biscuits"],
      stock: 80,
      tags: ["chocolate", "bestseller"],
      dietary: [],
      published: true,
      featured: true,
    },
    {
      name: "Oatmeal Raisin Cookies",
      slug: "oatmeal-raisin-cookies",
      description: "Wholesome oatmeal cookies studded with plump raisins and a hint of cinnamon.",
      price: 5.49,
      categoryId: catMap["cookies-biscuits"],
      stock: 60,
      tags: ["healthy", "classic"],
      dietary: ["Nut-Free"],
      published: true,
      featured: false,
    },
    {
      name: "Butter Croissants (4-pack)",
      slug: "butter-croissants-4-pack",
      description: "Flaky, golden butter croissants made with imported French butter. Pack of 4.",
      price: 8.99,
      comparePrice: 10.99,
      categoryId: catMap["pastries-pies"],
      stock: 40,
      tags: ["fresh", "premium"],
      dietary: [],
      published: true,
      featured: true,
    },
    {
      name: "Mixed Nut Medley",
      slug: "mixed-nut-medley",
      description: "Premium blend of roasted almonds, cashews, pecans, and macadamia nuts. Lightly salted.",
      price: 9.99,
      categoryId: catMap["nuts-trail-mix"],
      stock: 90,
      tags: ["protein", "premium"],
      dietary: ["Vegan", "Gluten-Free"],
      published: true,
      featured: true,
    },
    {
      name: "Trail Mix Adventure",
      slug: "trail-mix-adventure",
      description: "Energizing mix of nuts, seeds, dried cranberries, and dark chocolate pieces.",
      price: 7.49,
      categoryId: catMap["nuts-trail-mix"],
      stock: 70,
      tags: ["energy", "outdoor"],
      dietary: ["Gluten-Free"],
      published: true,
      featured: false,
    },
    {
      name: "Gummy Bear Party Pack",
      slug: "gummy-bear-party-pack",
      description: "Colorful assortment of fruity gummy bears in a generous party-size bag.",
      price: 4.99,
      categoryId: catMap["candy-sweets"],
      stock: 200,
      tags: ["kids", "party"],
      dietary: ["Gluten-Free", "Nut-Free"],
      published: true,
      featured: false,
    },
    {
      name: "Caramel Popcorn Crunch",
      slug: "caramel-popcorn-crunch",
      description: "Sweet and crunchy caramel-coated popcorn. Perfect for movie nights and snacking.",
      price: 5.99,
      categoryId: catMap["popcorn"],
      stock: 110,
      tags: ["sweet", "movie night"],
      dietary: ["Gluten-Free"],
      published: true,
      featured: true,
    },
    {
      name: "Organic Veggie Sticks",
      slug: "organic-veggie-sticks",
      description: "Crunchy baked vegetable sticks made from real sweet potatoes, beets, and spinach.",
      price: 6.49,
      categoryId: catMap["healthy-snacks"],
      stock: 65,
      tags: ["organic", "healthy"],
      dietary: ["Vegan", "Gluten-Free"],
      published: true,
      featured: false,
    },
    {
      name: "Sparkling Lemonade (6-pack)",
      slug: "sparkling-lemonade-6-pack",
      description: "Refreshing sparkling lemonade made with real lemons. No artificial sweeteners.",
      price: 7.99,
      categoryId: catMap["beverages"],
      stock: 50,
      tags: ["refreshing", "natural"],
      dietary: ["Vegan", "Gluten-Free"],
      published: true,
      featured: false,
    },
    {
      name: "Spicy Jalapeño Chips",
      slug: "spicy-jalapeno-chips",
      description: "Bold and fiery jalapeño flavored chips that bring the heat. Not for the faint-hearted!",
      price: 4.49,
      categoryId: catMap["chips-crisps"],
      stock: 95,
      tags: ["spicy", "bold"],
      dietary: ["Vegan"],
      published: true,
      featured: false,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log(`✅ ${products.length} products created`);

  // Create Promo Codes
  await prisma.promoCode.upsert({
    where: { code: "SNACK10" },
    update: {},
    create: {
      code: "SNACK10",
      discountType: "percentage",
      discountValue: 10,
      minOrder: 15,
      maxUses: 100,
      active: true,
    },
  });

  await prisma.promoCode.upsert({
    where: { code: "WELCOME5" },
    update: {},
    create: {
      code: "WELCOME5",
      discountType: "fixed",
      discountValue: 5,
      minOrder: 20,
      maxUses: 50,
      active: true,
    },
  });
  console.log("✅ Promo codes created");

  console.log("🎉 Database seeded successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("  Admin:    admin@zozagateway.com / Admin@123");
  console.log("  Customer: customer@example.com / Customer@123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
