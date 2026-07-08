import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/lib/endpoints/user-endpoints";

export function useUserById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}
