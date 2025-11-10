"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

export interface Customer {
  id: string;
  name: string | null;
  image: string | null;
  phone: string | null;
  address: string | null;
  addressNumber: number | null;
  zipCode: string | null;
  complement: string | null;
  city: string | null;
  state: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    role: string;
  } | null;
}

// Query Keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: string) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

// Fetch all customers
async function fetchCustomers(): Promise<Customer[]> {
  const response = await axiosInstance.get("/customers");
  if (response.status !== 200) {
    throw new Error("Failed to fetch customers");
  }
  
  // Serialize dates
  return response.data.map((customer: any) => ({
    ...customer,
    createdAt: customer.createdAt
      ? new Date(customer.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: customer.updatedAt
      ? new Date(customer.updatedAt).toISOString()
      : new Date().toISOString(),
  }));
}

export interface UpdateCustomerInput {
  name?: string;
  image?: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  zipCode?: string;
  complement?: string;
  city?: string;
  state?: string;
}

// Update customer
async function updateCustomer(
  id: string,
  data: UpdateCustomerInput
): Promise<Customer> {
  // Clean data: only include fields with actual values (not empty strings)
  const cleanedData: UpdateCustomerInput = {};
  
  // Only include fields that have non-empty values
  if (data.name !== undefined && data.name.trim() !== "") {
    cleanedData.name = data.name.trim();
  }
  
  if (data.phone !== undefined && data.phone.trim() !== "") {
    cleanedData.phone = data.phone.trim();
  }
  
  if (data.address !== undefined && data.address.trim() !== "") {
    cleanedData.address = data.address.trim();
  }
  
  if (data.addressNumber !== undefined && data.addressNumber !== "") {
    const num = Number(data.addressNumber);
    if (!isNaN(num) && num > 0) {
      cleanedData.addressNumber = num.toString();
    }
  }
  
  if (data.zipCode !== undefined && data.zipCode.trim() !== "") {
    cleanedData.zipCode = data.zipCode.trim();
  }
  
  if (data.complement !== undefined && data.complement.trim() !== "") {
    cleanedData.complement = data.complement.trim();
  }
  
  if (data.city !== undefined && data.city.trim() !== "") {
    cleanedData.city = data.city.trim();
  }
  
  if (data.state !== undefined && data.state.trim() !== "") {
    cleanedData.state = data.state.trim();
  }

  const response = await axiosInstance.put(`/customers/${id}`, cleanedData);
  if (response.status !== 200) {
    const errorMessage = response.data?.message || response.data?.error || "Failed to update customer";
    throw new Error(errorMessage);
  }

  // Serialize dates
  const customer = response.data;
  return {
    ...customer,
    createdAt: customer.createdAt
      ? new Date(customer.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: customer.updatedAt
      ? new Date(customer.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

// Hook to fetch all customers
export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: fetchCustomers,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch single customer
async function fetchCustomer(id: string): Promise<Customer> {
  const response = await axiosInstance.get(`/customers/${id}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch customer");
  }
  
  const customer = response.data;
  return {
    ...customer,
    createdAt: customer.createdAt
      ? new Date(customer.createdAt).toISOString()
      : new Date().toISOString(),
    updatedAt: customer.updatedAt
      ? new Date(customer.updatedAt).toISOString()
      : new Date().toISOString(),
  };
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });
}

// Hook to update customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerInput }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      // Invalidate customers list to refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

