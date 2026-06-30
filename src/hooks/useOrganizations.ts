import { useQuery } from "@tanstack/react-query";
import {
  getOrganizationById,
  getOrganizationBySlug,
  getAllOrganizations,
} from "@/lib/endpoints";

export function useOrganizationById(id: string | null | undefined) {
  return useQuery({
    queryKey: ["organizations", id],
    queryFn: () => getOrganizationById(id!),
    enabled: !!id,
  });
}

export function useOrganizationBySlug(slug: string | null | undefined) {
  return useQuery({
    queryKey: ["organizations", "slug", slug],
    queryFn: () => getOrganizationBySlug(slug!),
    enabled: !!slug,
  });
}

export function useAllOrganizations() {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () => getAllOrganizations(),
  });
}
