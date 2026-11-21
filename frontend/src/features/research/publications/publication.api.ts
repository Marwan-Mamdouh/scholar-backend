import { api, type ApiResponse, type Paginated } from "@/src/lib/api-client";
import type {
  Publication,
  PublicationFacets,
  PublicationFilters,
  PublicationQuery,
} from "./publication.type";

export function countPublicationFilters(filters: PublicationFilters) {
  return Object.values(filters).filter((values) => values.length > 0).length;
}

export const PUBLICATIONS_PAGE_SIZE = 10;

export async function fetchPublications(
  {
    search,
    page = 1,
    limit = PUBLICATIONS_PAGE_SIZE,
    categoryIds,
    publicationTypes,
    accessModels,
    publishers,
    quartiles,
  }: PublicationQuery,
  signal?: AbortSignal,
): Promise<Paginated<Publication>> {
  const { data } = await api.get<Paginated<Publication>>("/publications", {
    params: {
      search: search?.trim() || undefined,
      page,
      limit,
      categoryIds: categoryIds?.join(",") || undefined,
      publicationTypes: publicationTypes?.join(",") || undefined,
      accessModels: accessModels?.join(",") || undefined,
      publishers: publishers?.join(",") || undefined,
      quartiles: quartiles?.join(",") || undefined,
    },
    signal,
  });
  return data;
}

export async function fetchPublicationFacets(signal: AbortSignal) {
  const { data } = await api.get<ApiResponse<PublicationFacets>>(
    "/publications/filters",
    { signal },
  );
  return data.data;
}
