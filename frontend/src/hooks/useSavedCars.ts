import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';

export const useSavedCars = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['savedCars'],
    queryFn: async () => {
      const { data } = await apiClient.get('/my-cars');
      return data.data;
    },
    ...options,
  });
};

export const useAddSavedCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carData: { variantId: number; nickname?: string }) => {
      const { data } = await apiClient.post('/my-cars', carData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedCars'] });
    },
  });
};

export const useDeleteSavedCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete(`/my-cars/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedCars'] });
    },
  });
};
