"use client";

import { SettingsLogoUpload } from "@/components/settings-logo-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAdminSettings,
  useUpdateSettings,
  type Settings,
} from "@/hooks/use-settings";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

export function SettingsManager() {
  // Use TanStack Query hooks
  const { data: adminSettings, isLoading } = useAdminSettings();
  const updateSettingsMutation = useUpdateSettings();

  // Initialize form state from fetched settings
  const [settings, setSettings] = useState<Settings>({
    id: null,
    companyName: "",
    companyId: "",
    pixKey: "",
    phone: "",
    email: "",
    logo: null,
    creditCardAvailable: false,
    createdAt: null,
    updatedAt: null,
  });
  const [error, setError] = useState("");

  // Update local state when adminSettings loads
  useEffect(() => {
    if (adminSettings) {
      setSettings({
        ...adminSettings,
        companyId: adminSettings.companyId || "",
        pixKey: adminSettings.pixKey || "",
        phone: adminSettings.phone || "",
        email: adminSettings.email || "",
        logo: adminSettings.logo || null,
      });
    }
  }, [adminSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "phone") {
      const formatted = formatPhoneNumber(value);
      setSettings({
        ...settings,
        [id]: formatted,
      });
    } else {
      setSettings({
        ...settings,
        [id]: value,
      });
    }
    setError("");
  };

  const handleLogoUpdate = (logoUrl: string) => {
    setSettings({
      ...settings,
      logo: logoUrl,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const updateData = {
        companyName: settings.companyName,
        companyId: settings.companyId || undefined,
        pixKey: settings.pixKey || undefined,
        phone: settings.phone || undefined,
        email: settings.email || undefined,
        logo: settings.logo || undefined,
        creditCardAvailable: settings.creditCardAvailable,
      };

      const updatedSettings = await updateSettingsMutation.mutateAsync(
        updateData
      );

      // Update local state with response
      setSettings({
        ...updatedSettings,
        companyId: updatedSettings.companyId || "",
        pixKey: updatedSettings.pixKey || "",
        phone: updatedSettings.phone || "",
        email: updatedSettings.email || "",
        logo: updatedSettings.logo || null,
      });

      toast.success("Configurações salvas com sucesso!");
    } catch (err: any) {
      setError(err.message || "Falha ao salvar configurações");
      toast.error(err.message || "Falha ao salvar configurações");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Carregando configurações...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Empresa Card */}
        <Card>
          <CardHeader>
            <CardTitle>Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Nome da Empresa *</Label>
              <Input
                id="companyName"
                placeholder="Ex: Lava Jato Central"
                value={settings.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="companyId">CNPJ/ID da Empresa</Label>
              <Input
                id="companyId"
                placeholder="Ex: 12.345.678/0001-90"
                value={settings.companyId || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logomarca Card */}
        <Card>
          <CardHeader>
            <CardTitle>Logomarca</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsLogoUpload
              currentLogo={settings.logo}
              onLogoUpdate={handleLogoUpdate}
            />
          </CardContent>
        </Card>

        {/* Contato Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={settings.phone || ""}
                onChange={handleChange}
                maxLength={15}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                value={settings.email || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pagamento Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                placeholder="Ex: contato@empresa.com ou (11) 99999-9999"
                value={settings.pixKey || ""}
                onChange={handleChange}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chave PIX para recebimento de pagamentos (opcional)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="creditCardAvailable">Cartão de Crédito</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Habilitar pagamento por cartão de crédito
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3,99% + R$ 0,39 por transação.
                  <a
                    href="https://stripe.com/br/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {" "}
                    Saiba mais
                  </a>
                </p>
              </div>
              <Switch
                id="creditCardAvailable"
                checked={settings.creditCardAvailable}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, creditCardAvailable: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end w-full">
          <Button
            type="submit"
            disabled={updateSettingsMutation.isPending}
            className="min-w-[120px] w-full "
          >
            {updateSettingsMutation.isPending
              ? "Salvando..."
              : "Salvar Configurações"}
          </Button>
        </div>
      </form>

      {/* Settings Info */}
      {settings.updatedAt && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Informações do Sistema</CardTitle>
            <CardDescription>
              <p>
                Última atualização:{" "}
                {new Date(settings.updatedAt).toLocaleString("pt-BR")}
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
