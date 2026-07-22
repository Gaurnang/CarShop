import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';

interface CatalogFilters {
  page?: number;
  limit?: number;
  savedCarId?: string;
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  order?: string;
  variantId?: number;
}

export const useCatalog = (filters: CatalogFilters) => {
  return useQuery({
    queryKey: ['catalog', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/catalog', { params: filters });
      return data;
    },
  });
};
