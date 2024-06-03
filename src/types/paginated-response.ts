export interface PaginatedResponse<Resource> {
  pageInfo: PageData;
  results: Resource[];
}

interface PageData {
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}
