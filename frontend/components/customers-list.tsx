"use client";

import { EditCustomerDialog } from "@/components/edit-customer-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useCustomers, type Customer } from "@/hooks/use-customers";
import {
  Building2,
  Edit,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

function CustomerCard({ customer }: { customer: Customer }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const displayName = customer.name || customer.user?.name || "Sem nome";
  const displayEmail = customer.user?.email || "Sem email";
  const displayImage = customer.image || customer.user?.avatarUrl;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const addressParts = [
    customer.address,
    customer.addressNumber ? `Nº ${customer.addressNumber}` : null,
    customer.complement,
  ]
    .filter(Boolean)
    .join(", ");

  const locationParts = [customer.city, customer.state]
    .filter(Boolean)
    .join(" - ");

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={displayImage || undefined} alt={displayName} />
              <AvatarFallback className="bg-purple-100 text-purple-700 text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{displayName}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Mail className="h-3 w-3" />
                {displayEmail}
              </CardDescription>
              {customer.user && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="capitalize">
                    {customer.user.role.toLowerCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customer.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
            )}
            {addressParts && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <div>{addressParts}</div>
                  {customer.zipCode && (
                    <div className="text-xs mt-1">CEP: {customer.zipCode}</div>
                  )}
                  {locationParts && (
                    <div className="text-xs mt-1">{locationParts}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </CardFooter>
      </Card>
      <EditCustomerDialog
        customer={customer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}

export function CustomersList() {
  const { data: customers, isLoading, error } = useCustomers();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase().trim();
    return customers.filter((customer) => {
      const name = (customer.name || customer.user?.name || "").toLowerCase();
      const email = (customer.user?.email || "").toLowerCase();
      const phone = (customer.phone || "").toLowerCase();
      const city = (customer.city || "").toLowerCase();
      const state = (customer.state || "").toLowerCase();
      const address = (customer.address || "").toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        city.includes(query) ||
        state.includes(query) ||
        address.includes(query)
      );
    });
  }, [customers, searchQuery]);

  if (isLoading) {
    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtrar Clientes
            </CardTitle>
            <CardDescription>
              Digite para buscar por nome, email, telefone, cidade ou endereço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Buscar clientes..."
              disabled
              className="animate-pulse"
            />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
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
      </>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            Erro ao carregar clientes
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

  if (!customers || customers.length === 0) {
    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtrar Clientes
            </CardTitle>
            <CardDescription>
              Digite para buscar por nome, email, telefone, cidade ou endereço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Buscar clientes..." disabled />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Nenhum cliente encontrado
            </CardTitle>
            <CardDescription>
              Não há clientes cadastrados no sistema ainda.
            </CardDescription>
          </CardHeader>
        </Card>
      </>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtrar Clientes
          </CardTitle>
          <CardDescription>
            {searchQuery
              ? `${filteredCustomers.length} cliente(s) encontrado(s)`
              : `Total de ${customers.length} cliente(s) cadastrado(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Buscar por nome, email, telefone, cidade ou endereço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </CardContent>
      </Card>

      {filteredCustomers.length === 0 && searchQuery ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Nenhum resultado encontrado
            </CardTitle>
            <CardDescription>
              Não há clientes que correspondam à sua busca "{searchQuery}".
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </>
  );
}
