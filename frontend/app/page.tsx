"use client";

import { HeaderNav } from "@/components/header-nav";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sampleData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fce7f3] via-white to-[#a855f7]/5">
      <HeaderNav />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-[#a855f7] to-[#f9a8d4] bg-clip-text text-transparent">
            Mel Bijour
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Welcome to your Next.js application with TanStack Query, shadcn/ui,
            NextAuth, and Recharts
          </p>
          {session ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-[#7c3aed]">
                Signed in as {session.user?.email || session.user?.name}
              </p>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link href="/auth/signin">
                <Button variant="default">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-[#a855f7]">
              Next.js 16
            </h2>
            <p className="text-muted-foreground">
              Latest version with App Router and React Server Components
            </p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-[#a855f7]">
              TanStack Query
            </h2>
            <p className="text-muted-foreground">
              Powerful data synchronization for React applications
            </p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-2 text-[#a855f7]">
              shadcn/ui
            </h2>
            <p className="text-muted-foreground">
              Beautiful and accessible components built with Radix UI
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#a855f7]">
            Sample Chart
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
        </div>
      </div>
    </div>
  );
}
