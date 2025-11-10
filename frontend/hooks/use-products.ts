"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export enum ProductCategory {
  NECKLACE = "NECKLACE",
  EARRING = "EARRING",
  BRACELET = "BRACELET",
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  currentStock: number;
  value: number;
  productCategory: ProductCategory;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  image?: string;
  currentStock?: number;
  value: number;
  productCategory: ProductCategory;
}

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Fetch all products
async function fetchProducts(): Promise<Product[]> {
  const response = await axiosInstance.get("/products");
  if (response.status !== 200) {
    throw new Error("Failed to fetch products");
  }
  
  // Serialize dates
  return response.data.map((product: any) => ({
    ...product,
    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : new Date().toISOString(),
  }));
}

// Create product
async function createProduct(data: CreateProductInput): Promise<Product> {
  const response = await axiosInstance.post("/products", data);
  if (response.status !== 201) {
    throw new Error("Failed to create product");
  }

  // Serialize dates
  const product = response.data;
  return {
    ...product,
    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

// Hook to fetch all products
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to create product
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

