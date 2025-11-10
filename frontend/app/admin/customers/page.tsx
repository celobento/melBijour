import { CustomersList } from "@/components/customers-list";
import { HeaderNav } from "@/components/header-nav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminCustomersPage() {
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
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r text-purple-400 bg-clip-text">
            Clientes
          </h1>
          <p className="text-purple-300">
            Visualize e gerencie todos os clientes cadastrados no sistema
          </p>
        </div>

        <CustomersList />
      </main>
    </div>
  );
}
