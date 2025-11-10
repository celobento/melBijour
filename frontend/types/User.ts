import type { Customer } from "./Customer";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatarUrl?: string | null;
  customerId?: string | null;
  customer: Customer | null;
  createdAt: string;
  updatedAt: string;
};