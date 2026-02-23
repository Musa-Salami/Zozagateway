import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { BottomTabBar } from "@/components/storefront/BottomTabBar";
import { ProductViewProvider } from "@/components/storefront/ProductViewProvider";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProductViewProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomTabBar />
      </div>
    </ProductViewProvider>
  );
}
