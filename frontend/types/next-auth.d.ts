import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      email?: string | null
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    imagem?: string;
    customerId?: string;   
  }
}

