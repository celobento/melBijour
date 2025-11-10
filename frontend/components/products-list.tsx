"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ProductCategory,
  useProducts,
  type Product,
} from "@/hooks/use-products";
import { Package, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AddProductDialog } from "./add-product-dialog";
import { Button } from "./ui/button";

function ProductCard({ product }: { product: Product }) {
  const categoryLabels: Record<ProductCategory, string> = {
    [ProductCategory.NECKLACE]: "Colar",
    [ProductCategory.EARRING]: "Brinco",
    [ProductCategory.BRACELET]: "Pulseira",
  };

  const categoryColors: Record<ProductCategory, string> = {
    [ProductCategory.NECKLACE]: "bg-purple-100 text-purple-700",
    [ProductCategory.EARRING]: "bg-pink-100 text-pink-700",
    [ProductCategory.BRACELET]: "bg-blue-100 text-blue-700",
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {product.image && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{product.name}</CardTitle>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                categoryColors[product.productCategory]
              }`}
            >
              {categoryLabels[product.productCategory]}
            </span>
          </div>
        </div>
        {product.description && (
          <CardDescription className="mt-2">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Preço:</span>
            <span className="text-lg font-bold text-purple-600">
              {formatCurrency(product.value)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estoque:</span>
            <span
              className={`text-sm font-semibold ${
                product.currentStock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.currentStock} unidades
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductsList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: products, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const name = product.name.toLowerCase();
      const description = (product.description || "").toLowerCase();
      const category = product.productCategory.toLowerCase();

      return (
        name.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [products, searchQuery]);

  if (isLoading) {
    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtrar Produtos
            </CardTitle>
            <CardDescription>
              Digite para buscar por nome, descrição ou categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar produtos..."
                disabled
                className="animate-pulse flex-1"
              />
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AddProductDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </>
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
      <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtrar Produtos
            </CardTitle>
            <CardDescription>
              Digite para buscar por nome, descrição ou categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar produtos..."
                disabled
                className="flex-1"
              />
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Nenhum produto encontrado
            </CardTitle>
            <CardDescription>
              Não há produtos cadastrados no sistema ainda.
            </CardDescription>
          </CardHeader>
        </Card>

        <AddProductDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtrar Produtos
          </CardTitle>
          <CardDescription>
            {searchQuery
              ? `${filteredProducts.length} produto(s) encontrado(s)`
              : `Total de ${products.length} produto(s) cadastrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nome, descrição ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </div>
        </CardContent>
      </Card>

      {filteredProducts.length === 0 && searchQuery ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Nenhum resultado encontrado
            </CardTitle>
            <CardDescription>
              Não há produtos que correspondam à sua busca "{searchQuery}".
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}
