"use client";

import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/lib/states";
import { useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../lib/axios";
import type { Customer } from "../types/Customer";

interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface ProfileFormProps {
  user: ProfileUser;
  customer: Customer;
}

const formatPhoneNumber = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  // Apply Brazilian phone format: (XX) XXXXX-XXXX
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`;
  }
};

const formatZipCode = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");

  // Apply Brazilian zip code format: XXXXX-XXX
  if (digits.length <= 5) {
    return digits;
  } else {
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  }
};

export function ProfileForm({ user, customer }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    image: customer.image || "",
    phone: customer.phone || "",
    address: customer.address || "",
    addressNumber: customer.addressNumber || "",
    zipCode: customer.zipCode || "",
    complement: customer.complement || "",
    city: customer.city || "",
    state: customer.state || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "phone") {
      const formatted = formatPhoneNumber(value);
      setFormData({
        ...formData,
        [id]: formatted,
      });
    } else if (id === "zipCode") {
      const formatted = formatZipCode(value);
      setFormData({
        ...formData,
        [id]: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
    setError("");
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      state: value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate password fields if any password field is filled
      if (
        formData.currentPassword ||
        formData.newPassword ||
        formData.confirmPassword
      ) {
        if (!formData.currentPassword) {
          throw new Error("Senha atual é obrigatória para alterar a senha");
        }
        if (!formData.newPassword) {
          throw new Error("Nova senha é obrigatória");
        }
        if (formData.newPassword.length < 8) {
          throw new Error("Nova senha deve ter pelo menos 8 caracteres");
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("Confirmação de senha não confere");
        }
      }

      const payload = {
        avatarUrl: formData.image || undefined,
        image: formData.image || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        addressNumber: formData.addressNumber || undefined,
        zipCode: formData.zipCode || undefined,
        complement: formData.complement || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      };

      const { data } = await axiosInstance.patch(`/users/${user.id}`, payload);

      if (!data) {
        throw new Error("Falha ao atualizar perfil");
      }

      toast.success("Perfil atualizado com sucesso!");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Falha ao atualizar perfil";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = async (imageUrl: string) => {
    try {
      setIsLoading(true);
      console.log("imageUrl: " + imageUrl);
      console.log("customer.id: " + customer.id);
      const { data } = await axiosInstance.patch(`/customers/${customer.id}`, {
        image: imageUrl,
      });

      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Falha ao atualizar imagem";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                {customer.image ? (
                  <img
                    src={customer.image}
                    alt={customer.name || "User"}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {customer.name || "Nome não informado"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-center items-center">
              <ImageUpload
                userId={user.id}
                onImageChange={(url) =>
                  setFormData((prev) => ({ ...prev, image: url }))
                }
                onImageUpdate={handleImageUpdate}
                disabled={isLoading}
              />
            </div>
          </CardFooter>
        </Card>

        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (ZAP)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                maxLength={15}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Seu número de telefone (opcional)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Address and Number */}

              <div className="flex gap-2">
                <div className="w-4/5  md:col-span-2 space-y-2">
                  <Label htmlFor="address">Logradouro</Label>
                  <Input
                    id="address"
                    placeholder="Rua, Avenida, etc."
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/5 space-y-2">
                  <Label htmlFor="addressNumber">Número</Label>
                  <Input
                    id="addressNumber"
                    type="number"
                    placeholder="123"
                    value={formData.addressNumber}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Complement */}
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  placeholder="Apartamento, casa, etc."
                  value={formData.complement}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {/* City, State, Zip Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex space-y-2">
                  <div className="w-2/3 space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select
                      value={formData.state}
                      onValueChange={handleSelectChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.code} - {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-1/3 space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      placeholder="01234-567"
                      value={formData.zipCode}
                      onChange={handleChange}
                      disabled={isLoading}
                      maxLength={9}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-100  border border-red-400  text-red-800 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Password Section */}
            <div className="space-y-4 ">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Deixe em branco se não quiser alterar a senha
              </p>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  minLength={8}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Mínimo de 8 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-2 justify-between w-full">
          <Button
            type="button"
            className="w-1/2"
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" className="w-1/2" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </>
  );
}
