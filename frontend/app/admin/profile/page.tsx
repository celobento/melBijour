import { HeaderNav } from "@/components/header-nav";
import { ProfileForm } from "@/components/profile-form";
import { auth } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import type { Customer } from "@/types/Customer";
import type { User } from "@/types/User";
import { redirect } from "next/navigation";

type UserWithCustomer = User & { customer: Customer | null };

export default async function AdminProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  let user: UserWithCustomer | null = null;

  try {
    const response = await axiosInstance.get<User>(`/users/${session.user.id}`);
    user = response.data;
  } catch (error) {
    console.error("Failed to load user data", error);
    redirect("/auth/signin");
  }

  if (!user || !user.customer) {
    redirect("/auth/signin");
  }

  const customer = user.customer;
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fce7f3] via-white to-[#a855f7]/5">
      <HeaderNav
        user={session.user}
        imagem={session.user.avatarUrl ?? ""}
        isAdmin={session.user.role === "ADMIN"}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-linear-to-r text-purple-400 bg-clip-text ">
              Meus Dados
            </h1>
            <p className="text-purple-300">
              Gerencie suas informações pessoais e configurações da conta
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <ProfileForm user={userData} customer={customer} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
