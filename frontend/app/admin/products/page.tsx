import { HeaderNav } from "@/components/header-nav";
import { ProductsPageContent } from "@/components/products-page-content";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Check if user is admin
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fce7f3] via-white to-[#a855f7]/5">
      <HeaderNav
        user={session?.user}
        imagem={session?.user?.avatarUrl as string}
        isAdmin={isAdmin}
      />

      <main className="container mx-auto px-4 py-8">
        <ProductsPageContent />
      </main>
    </div>
  );
}
