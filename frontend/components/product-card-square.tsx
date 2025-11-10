"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProducts, type Product } from "@/hooks/use-products";
import { useCheckoutStore } from "@/stores/checkout-store";

interface ProductCardSquareProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: (product: Product) => void;
}

function ProductCardSquare({
  product,
  isSelected = false,
  onSelect,
}: ProductCardSquareProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(product);
    }
  };

  return (
    <Card
      className={`aspect-square cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-purple-500 shadow-lg" : ""
      }`}
      onClick={handleClick}
    >
      {product.image ? (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
          <span className="text-muted-foreground text-sm">Sem imagem</span>
        </div>
      )}
      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-2 mb-1">
          {product.name}
        </CardTitle>
        {product.description && (
          <CardDescription className="text-xs line-clamp-2">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mt-auto">
          <span className="text-lg font-bold text-purple-600">
            {formatCurrency(product.value)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProductsGridProps {
  onProductSelect?: (product: Product) => void;
  selectedProducts?: Product[];
}

export function ProductsGrid({
  onProductSelect,
  selectedProducts: selectedProductsProp,
}: ProductsGridProps) {
  const { products: selectedProductsFromStore } = useCheckoutStore();

  // Use prop if provided, otherwise use store
  const selectedProducts = selectedProductsProp ?? selectedProductsFromStore;
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="aspect-square animate-pulse">
            <div className="w-full h-48 bg-muted rounded-t-lg" />
            <CardHeader className="p-4">
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-full" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-6 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Erro ao carregar produtos
          </CardTitle>
          <CardDescription>
            {error instanceof Error
              ? error.message
              : "Ocorreu um erro desconhecido"}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum produto disponível</CardTitle>
          <CardDescription>
            Não há produtos cadastrados no momento.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product: Product) => (
        <ProductCardSquare
          key={product.id}
          product={product}
          isSelected={selectedProducts.some(
            (p: Product) => p.id === product.id
          )}
          onSelect={onProductSelect}
        />
      ))}
    </div>
  );
}
