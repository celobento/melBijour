"use client";

import { PixPaymentModal } from "@/components/pix-payment-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomer } from "@/hooks/use-customers";
import { type Product } from "@/hooks/use-products";
import { useCreateSale, type SalesProductInput } from "@/hooks/use-sales";
import { useAdminSettings } from "@/hooks/use-settings";
import { useCheckoutStore } from "@/stores/checkout-store";
import { MapPin, Package, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CheckoutContentProps {
  customerId: string;
}

export function CheckoutContent({ customerId }: CheckoutContentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    products: selectedProducts,
    removeProduct,
    clearProducts,
  } = useCheckoutStore();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const createSaleMutation = useCreateSale();

  // Get customer data
  const { data: customer } = useCustomer(customerId);

  // Get settings for PIX key
  const { data: settings } = useAdminSettings();

  // Initialize quantities when products change
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const initialQuantities: Record<string, number> = {};
      selectedProducts.forEach((product) => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [selectedProducts]);

  // Redirect if no products
  useEffect(() => {
    if (selectedProducts.length === 0) {
      router.push("/");
    }
  }, [selectedProducts.length, router]);

  // Don't render if no products
  if (selectedProducts.length === 0) {
    return null;
  }

  const updateQuantity = (productId: string, qty: number) => {
    if (qty < 1) return;
    const product = selectedProducts.find((p: Product) => p.id === productId);
    if (product && qty > product.currentStock) {
      toast.error(`Estoque disponível: ${product.currentStock} unidades`);
      return;
    }
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const handleRemoveProduct = (productId: string) => {
    removeProduct(productId);
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[productId];
      return newQuantities;
    });
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total: number, product: Product) => {
      const qty = quantities[product.id] || 1;
      return total + product.value * qty;
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleSubmit = async () => {
    if (!session?.user?.customerId) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Nenhum produto selecionado");
      return;
    }

    // Validate address
    if (!customer?.address || !customer?.city || !customer?.state) {
      toast.error(
        "Por favor, complete seu endereço antes de finalizar a compra"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const salesProducts: SalesProductInput[] = selectedProducts.map(
        (product) => {
          const qty = quantities[product.id] || 1;
          return {
            productId: product.id,
            qtd: qty,
            unitVlr: product.value,
            totalValue: product.value * qty,
          };
        }
      );

      const total = calculateTotal();

      await createSaleMutation.mutateAsync({
        customerId: session.user.customerId,
        total,
        state: "CREATED",
        salesProducts,
      });

      toast.success("Pedido criado com sucesso!");

      // Clear checkout products from store
      clearProducts();

      // Redirect to a success page or home
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao criar pedido";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = calculateTotal();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Products Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produtos Selecionados
            </CardTitle>
            <CardDescription>
              {selectedProducts.length} produto(s) no carrinho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedProducts.map((product: Product) => {
              const qty = quantities[product.id] || 1;
              const subtotal = product.value * qty;
              return (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 border rounded-lg"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`qty-${product.id}`}>Qtd:</Label>
                        <Input
                          id={`qty-${product.id}`}
                          type="number"
                          min="1"
                          max={product.currentStock}
                          value={qty}
                          onChange={(e) =>
                            updateQuantity(
                              product.id,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-20"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Estoque: {product.currentStock}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatCurrency(subtotal)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(product.value)} cada
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="mt-2 text-destructive"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Address Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço de Entrega
            </CardTitle>
            <CardDescription>Confirme ou atualize seu endereço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer ? (
              <div className="space-y-2">
                <div>
                  <Label>Nome</Label>
                  <p className="text-sm">{customer.name || "Não informado"}</p>
                </div>
                <div>
                  <Label>Endereço</Label>
                  <p className="text-sm">
                    {customer.address || "Não informado"}
                    {customer.addressNumber && `, ${customer.addressNumber}`}
                    {customer.complement && ` - ${customer.complement}`}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cidade</Label>
                    <p className="text-sm">
                      {customer.city || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <p className="text-sm">
                      {customer.state || "Não informado"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label>CEP</Label>
                  <p className="text-sm">
                    {customer.zipCode || "Não informado"}
                  </p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <p className="text-sm">{customer.phone || "Não informado"}</p>
                </div>
                {(!customer.address || !customer.city || !customer.state) && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Por favor, complete seu endereço antes de finalizar a
                      compra.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Carregando dados do cliente...
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {selectedProducts.map((product: Product) => {
                const qty = quantities[product.id] || 1;
                const subtotal = product.value * qty;
                return (
                  <div
                    key={product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {product.name} x{qty}
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-purple-600">{formatCurrency(total)}</span>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                selectedProducts.length === 0 ||
                !customer?.address ||
                !customer?.city ||
                !customer?.state
              }
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Processando..." : "Finalizar Pedido"}
            </Button>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => setIsPixModalOpen(true)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Pix
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* PIX Payment Modal */}
      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => setIsPixModalOpen(false)}
        bookingId={session?.user?.id || ""}
        totalPrice={total}
        pixKey={settings?.pixKey || ""}
        companyName={settings?.companyName}
        city={customer?.city || undefined}
      />
    </div>
  );
}
