import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["/api/settings"],
  });

  const updateSettings = useMutation({
    mutationFn: async (settings: Record<string, string>) => {
      const response = await apiRequest("PUT", "/api/settings", settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  return {
    ...query,
    updateSettings,
  };
}
