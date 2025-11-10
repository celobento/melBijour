import { auth } from "@/auth";
import { HeaderNav } from "@/components/header-nav";
import { SettingsManager } from "@/components/settings-manager";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderNav
        user={session?.user}
        imagem={session?.user?.imagem as string}
        isAdmin={isAdmin}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Configurações
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gerencie as configurações do sistema e informações da empresa
            </p>
          </div>

          <SettingsManager />
        </div>
      </main>
    </div>
  );
}
