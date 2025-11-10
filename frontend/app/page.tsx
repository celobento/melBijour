"use client";

import { HeaderNav } from "@/components/header-nav";
import { ProductsGrid } from "@/components/product-card-square";
import { Button } from "@/components/ui/button";
import { type Product } from "@/hooks/use-products";
import { useCheckoutStore } from "@/stores/checkout-store";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    products: selectedProducts,
    addProduct,
    removeProduct,
  } = useCheckoutStore();
  const isAdmin = session?.user?.role === "ADMIN";

  const handleProductSelect = (product: Product) => {
    const isAlreadySelected = selectedProducts.some(
      (p: Product) => p.id === product.id
    );
    if (isAlreadySelected) {
      removeProduct(product.id);
    } else {
      addProduct(product);
    }
  };

  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      return;
    }
    router.push("/checkout");
  };
  console.log(session);
  return (
    <div className="min-h-screen bg-linear-to-br from-[#fce7f3] via-white to-[#a855f7]/5">
      <HeaderNav
        user={session?.user}
        imagem={(session?.user?.avatarUrl as string) || ""}
        isAdmin={isAdmin}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-[#a855f7] to-[#f9a8d4] bg-clip-text text-transparent">
            Mel Bijour
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Escolha seus produtos favoritos
          </p>
          {selectedProducts.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-purple-600 font-semibold">
                {selectedProducts.length} produto(s) selecionado(s)
              </p>
              <Button
                onClick={handleCheckout}
                className="flex items-center gap-2"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                Ir para Checkout
              </Button>
            </div>
          )}
        </div>

        <ProductsGrid onProductSelect={handleProductSelect} />
      </div>
    </div>
  );
}
