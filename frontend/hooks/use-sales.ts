import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";


export interface SalesProductInput {
  productId: string;
  qtd: number;
  unitVlr: number;
  totalValue: number;
}

export interface CreateSalesInput {
  customerId: string;
  total: number;
  state?: "CREATED" | "CONCLUDED" | "CANCELLED";
  salesProducts: SalesProductInput[];
}

export interface Sales {
  id: string;
  customerId: string;
  total: number;
  state: "CREATED" | "CONCLUDED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  customer?: any;
  salesProducts?: any[];
  salesHistory?: any[];
}

// Query Keys
export const salesKeys = {
  all: ["sales"] as const,
  lists: () => [...salesKeys.all, "list"] as const,
  list: (filters: string) => [...salesKeys.lists(), { filters }] as const,
  details: () => [...salesKeys.all, "detail"] as const,
  detail: (id: string) => [...salesKeys.details(), id] as const,
};

// Fetch all sales
async function getSales(): Promise<Sales[]> {
  const response = await axiosInstance.get("/sales");
  return response.data;
}

// Fetch single sale
async function getSale(id: string): Promise<Sales> {
  const response = await axiosInstance.get(`/sales/${id}`);
  return response.data;
}

// Create sale
async function createSale(data: CreateSalesInput): Promise<Sales> {
  const response = await axiosInstance.post("/sales", data);
  if (response.status !== 201) {
    const errorMessage =
      response.data?.message || response.data?.error || "Failed to create sale";
    throw new Error(errorMessage);
  }
  return response.data;
}

// Update sale
async function updateSale(
  id: string,
  data: Partial<CreateSalesInput>
): Promise<Sales> {
  const response = await axiosInstance.put(`/sales/${id}`, data);
  if (response.status !== 200) {
    const errorMessage =
      response.data?.message || response.data?.error || "Failed to update sale";
    throw new Error(errorMessage);
  }
  return response.data;
}

// Delete sale
async function deleteSale(id: string): Promise<void> {
  const response = await axiosInstance.delete(`/sales/${id}`);
  if (response.status !== 200 && response.status !== 204) {
    const errorMessage =
      response.data?.message || response.data?.error || "Failed to delete sale";
    throw new Error(errorMessage);
  }
}

// Hooks
export function useSales() {
  return useQuery({
    queryKey: salesKeys.lists(),
    queryFn: getSales,
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: salesKeys.detail(id),
    queryFn: () => getSale(id),
    enabled: !!id,
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
    },
  });
}

export function useUpdateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSalesInput> }) =>
      updateSale(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: salesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesKeys.lists() });
    },
  });
}

