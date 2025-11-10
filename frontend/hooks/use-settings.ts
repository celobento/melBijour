"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

// Public settings interface (what regular users can see)
export interface PublicSettings {
  pixKey: string;
  companyName: string;
  creditCardAvailable: boolean;
  logo: string | null;
}

// Full settings interface (for admin)
export interface Settings {
  id: string | null;
  companyName: string;
  companyId: string | null;
  pixKey: string | null;
  phone: string | null;
  email: string | null;
  logo: string | null;
  creditCardAvailable: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

interface UpdateSettingsInput {
  companyName?: string;
  companyId?: string;
  pixKey?: string;
  phone?: string;
  email?: string;
  logo?: string;
  creditCardAvailable?: boolean;
}

// Query Keys
export const settingsKeys = {
  all: ["settings"] as const,
  public: () => [...settingsKeys.all, "public"] as const,
  admin: () => [...settingsKeys.all, "admin"] as const,
};

// Fetch public settings (pixKey, companyName, etc.)
async function fetchPublicSettings(): Promise<PublicSettings> {
  const response = await axiosInstance.get("/settings/pix-key");
  if (response.status !== 200) {
    // Return defaults if unauthorized or error
    return {
      pixKey: "",
      companyName: process.env.APP_NAME || "MelBijour-Demo",
      creditCardAvailable: false,
      logo: null,
    };
  }
  return {
    pixKey: response.data.pixKey || "",
    companyName: response.data.companyName || "MelBijour-Demo",
    creditCardAvailable: response.data.creditCardAvailable || false,
    logo: response.data.logo || null,
  };
}

// Fetch admin settings (full settings object)
async function fetchAdminSettings(): Promise<Settings> {
  const response = await axiosInstance.get("/settings/admin");
  if (response.status !== 200) {
    throw new Error("Falha ao buscar configurações");
  }
  const data = response.data;
  
  // Serialize dates
  return {
    ...data,
    createdAt: data.createdAt
      ? new Date(data.createdAt).toISOString()
      : null,
    updatedAt: data.updatedAt
      ? new Date(data.updatedAt).toISOString()
      : null,
  };
}

// Update settings (admin only)
async function updateSettings(data: UpdateSettingsInput): Promise<Settings> {
  console.log("data: " + JSON.stringify(data));
  const response = await axiosInstance.post("/settings/admin", data);
  if (response.status !== 201) {
    throw new Error(response.data.error || "Falha ao salvar configurações");
  }

  const result = response.data;
  
  // Serialize dates
  return {
    ...result.settings,
    createdAt: result.settings.createdAt
      ? new Date(result.settings.createdAt).toISOString()
      : null,
    updatedAt: result.settings.updatedAt
      ? new Date(result.settings.updatedAt).toISOString()
      : null,
  };
}

// Hook to fetch public settings (available to all authenticated users)
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.public(),
    queryFn: fetchPublicSettings,
    staleTime: 1000 * 60 * 240, // 10 minutes - settings don't change often
  });
}

// Hook to fetch admin settings (full settings object)
export function useAdminSettings() {
  return useQuery({
    queryKey: settingsKeys.admin(),
    queryFn: fetchAdminSettings,
    staleTime: 1000 * 60 * 240, // 5 minutes
  });
}

// Hook to update settings (admin only)
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      // Invalidate both public and admin settings queries
      queryClient.invalidateQueries({ queryKey: settingsKeys.public() });
      queryClient.invalidateQueries({ queryKey: settingsKeys.admin() });
    },
  });
}

