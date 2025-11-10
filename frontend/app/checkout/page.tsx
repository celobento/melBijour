import { CheckoutContent } from "@/components/checkout-content";
import { HeaderNav } from "@/components/header-nav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/checkout");
  }

  if (!session.user.customerId) {
    redirect("/");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fce7f3] via-white to-[#a855f7]/5">
      <HeaderNav
        user={session.user}
        imagem={(session.user?.avatarUrl as string) || ""}
        isAdmin={isAdmin}
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-[#a855f7] to-[#f9a8d4] bg-clip-text text-transparent">
            Checkout
          </h1>
          <p className="text-muted-foreground">
            Revise seus produtos e confirme o pedido
          </p>
        </div>

        <CheckoutContent customerId={session.user.customerId} />
      </div>
    </div>
  );
}
