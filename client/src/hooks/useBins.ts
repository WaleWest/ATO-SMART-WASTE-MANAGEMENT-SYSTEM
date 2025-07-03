import { useQuery } from "@tanstack/react-query";

export function useBins() {
  return useQuery({
    queryKey: ["/api/bins"],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}
