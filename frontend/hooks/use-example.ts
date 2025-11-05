import axiosInstance from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

// Example hook using TanStack Query with Axios 
export function useExampleData() {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      const response = await axiosInstance.get("/example")
      return response.data
    },
    enabled: false, // Disabled by default - enable when you have an API endpoint
  })
}

