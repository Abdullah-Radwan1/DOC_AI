import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/lib/endpoints/user-endpoints";
import { queryKeys } from "@/lib/query-keys";

export function useUserById(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}
