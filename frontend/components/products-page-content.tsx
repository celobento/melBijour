"use client";

import { ProductsList } from "@/components/products-list";

export function ProductsPageContent() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4 bg-linear-to-r text-purple-400 bg-clip-text">
          Produtos
        </h1>
        <p className="text-purple-300">
          Visualize e gerencie todos os produtos cadastrados no sistema
        </p>
      </div>

      <ProductsList />
    </>
  );
}
