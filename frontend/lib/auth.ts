import type { NextAuthOptions } from "next-auth"
import NextAuth, { getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import axiosInstance from "./axios"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Sign in with backend API
          const response = await axiosInstance.post("/auth/signin", {
            email: credentials.email,
            password: credentials.password,
          })

          if (response.data && response.data.user) {
            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              image: response.data.user.avatarUrl,
              role: response.data.user.role,
            }
          }
          return null
        } catch (error) {
          console.error("Sign in error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      // Handle Google OAuth
      if (account?.provider === "google") {
        try {
          // Register or sign in with Google user
          const response = await axiosInstance.post("/auth/google", {
            email: token.email,
            name: token.name,
            image: token.picture,
            googleId: account.providerAccountId,
          })
          if (response.data?.user) {
            token.id = response.data.user.id
            token.role = response.data.user.role
            token.imagem = response.data.user.avatarUrl
          }
        } catch (error) {
          console.error("Google auth error:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        if (token.imagem) {
          session.user.image = token.imagem as string
        }
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export const auth = () => getServerSession(authOptions)

export { handler as GET, handler as POST }

