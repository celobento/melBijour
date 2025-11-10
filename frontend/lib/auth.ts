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
            // Fetch user with customerId
            let customerId: string | undefined = undefined
            try {
              const userResponse = await axiosInstance.get(
                `/users/email/${encodeURIComponent(credentials.email)}`
              )
              customerId = userResponse.data?.customer?.id || undefined
            } catch (error) {
              console.error("Error fetching user by email:", error)
            }

            return {
              id: response.data.user.id,
              email: response.data.user.email,
              name: response.data.user.name,
              image: response.data.user.avatarUrl,
              role: response.data.user.role,
              customerId,
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
        token.customerId = (user as any).customerId || null
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

            // Fetch user with customerId
            try {
              const userResponse = await axiosInstance.get(
                `/users/email/${encodeURIComponent(token.email as string)}`
              )
              token.customerId = userResponse.data?.customer?.id || undefined
            } catch (error) {
              console.error("Error fetching user by email:", error)
              token.customerId = undefined
            }
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
        session.user.customerId = (token.customerId as string | null) || null
        if (token.imagem) {
          session.user.avatarUrl = token.imagem as string
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

