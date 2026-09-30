import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArtworks } from "../api/endpoints";

export function useArtworks(category?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: ["artworks", category, search],
    queryFn: ({ pageParam = 1 }) =>
      fetchArtworks({ page: pageParam, limit: 10, category, search }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });
}
