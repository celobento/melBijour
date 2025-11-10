"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSettingsLogoName from "../hooks/useSettingsLogoName";
interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface HeaderNavProps {
  user?: User;
  imagem?: string;
  isAdmin?: boolean;
}

export function HeaderNav({ user, imagem, isAdmin }: HeaderNavProps) {
  const router = useRouter();
  const { companyName, companyLogo } = useSettingsLogoName();
  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <nav className="bg-white bg-linear-to-br from-[#fce7f3] via-white to-[#a855f7]/5 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            )}
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            {companyName || "Lava Jato"}
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
                {isAdmin && (
                  <Link href="/admin/bookings">
                    <Button variant="outline" size="sm">
                      Agenda do dia
                    </Button>
                  </Link>
                )}
                <Button variant="outline" onClick={handleSignOut}>
                  Sair
                </Button>
              </div>

              {/* Mobile Menu - Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                    <SheetDescription>
                      Navegação e configurações da conta
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-1 space-y-4">
                    <div className="flex items-center justify-center gap-5 pb-4 pt-4 border-b border-t">
                      <Avatar className="w-15 h-15">
                        <AvatarImage src={imagem || undefined} />
                        <AvatarFallback>
                          {getInitials(user.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name || "User"}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link href="/" className="block">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          Home
                        </Button>
                      </Link>
                      <Link href="/admin/profile" className="block">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
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
                          Meus Dados
                        </Button>
                      </Link>

                      {isAdmin && (
                        <>
                          <Link href="/admin/dashboard" className="block">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                              </svg>
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/admin/bookings" className="block">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Agenda do Dia
                            </Button>
                          </Link>
                          <Link href="/admin/services" className="block">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001 1v1z"
                                />
                              </svg>
                              Gerenciar Serviços
                            </Button>
                          </Link>
                          <Link href="/admin/customers" className="block">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                            >
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              Gerenciar Clientes
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                  <SheetFooter>
                    <div className="flex flex-col gap-2 justify-center items-center">
                      <div className="flex w-full justify-between gap-2">
                        <Button
                          variant="outline"
                          onClick={handleSignOut}
                          className={`text-red-600 ${
                            isAdmin ? "w-1/2" : "w-full"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sair
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            onClick={() => router.push("/admin/settings")}
                            className={`w-1/2`}
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Configurações
                          </Button>
                        )}
                      </div>
                      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Versão 1.0.0
                      </div>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Avatar */}
              <Avatar className="cursor-pointer">
                <AvatarImage src={imagem || undefined} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {getInitials(user.name, user.email)}
                </AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Cadastre-se</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
