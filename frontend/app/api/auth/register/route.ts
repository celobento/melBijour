import { NextRequest, NextResponse } from "next/server"
import axiosInstance from "@/lib/axios"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Register user with backend API
    const response = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
    })

    return NextResponse.json(
      { message: "User registered successfully", user: response.data.user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        error:
          error.response?.data?.message || "Registration failed. Please try again.",
      },
      { status: error.response?.status || 500 }
    )
  }
}

