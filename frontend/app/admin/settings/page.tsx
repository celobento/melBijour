import { HeaderNav } from "@/components/header-nav";
import { SettingsManager } from "@/components/settings-manager";
import { auth } from "@/lib/auth";
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
    <div className="min-h-screen bg-linear-to-br from-[#fce7f3] via-white to-[#a855f7]/5">
      <HeaderNav
        user={session?.user}
        imagem={session?.user?.avatarUrl as string}
        isAdmin={isAdmin}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r text-purple-400 bg-clip-text ">
              Configurações
            </h1>
            <p className="text-purple-300">
              Gerencie as configurações do sistema e informações da empresa
            </p>
          </div>

          <SettingsManager />
        </div>
      </main>
    </div>
  );
}
