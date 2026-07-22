import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, X } from 'lucide-react';

interface Model {
  id: number;
  name: string;
  brand_name: string;
  brand_id: number;
}

interface Brand {
  id: number;
  name: string;
}

export const ModelsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<{ name: string; brandId: number }>();

  const { data: models, isLoading } = useQuery({
    queryKey: ['admin_models'],
    queryFn: async () => {
      const { data } = await apiClient.get('/models');
      return data.data;
    },
  });

  const { data: brands } = useQuery({
    queryKey: ['admin_brands'],
    queryFn: async () => {
      const { data } = await apiClient.get('/brands');
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; brandId: number }) => {
      const { data } = await apiClient.post('/models', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_models'] });
      toast.success('Model created');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error creating model')
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: number; name: string; brandId: number }) => {
      const { data } = await apiClient.put(`/models/${payload.id}`, { name: payload.name, brandId: payload.brandId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_models'] });
      toast.success('Model updated');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error updating model')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/models/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_models'] });
      toast.success('Model deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error deleting model')
  });

  const openModal = (model?: Model) => {
    if (model) {
      setEditingId(model.id);
      setValue('name', model.name);
      setValue('brandId', model.brand_id);
    } else {
      setEditingId(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = (data: { name: string; brandId: number }) => {
    // Ensure brandId is sent as a number
    const payload = { ...data, brandId: Number(data.brandId) };
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this model?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Models</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage vehicle models</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Model
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold w-24">ID</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Brand</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {models?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No models found.
                  </td>
                </tr>
              ) : (
                models?.map((model: Model) => (
                  <tr key={model.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{model.id}</td>
                    <td className="px-6 py-4 font-medium">{model.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{model.brand_name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(model)}
                          className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(model.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Model' : 'Create Model'}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <select
                  {...register('brandId', { required: true })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a brand...</option>
                  {brands?.map((brand: Brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model Name</label>
                <input
                  {...register('name', { required: true })}
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Civic"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
