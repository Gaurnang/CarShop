import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, X, Send, Check, Package } from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  subject: string;
  content: string;
  status: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
}

export const CampaignsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [productSearch, setProductSearch] = useState('');

  const { register, handleSubmit, reset } = useForm<{
    title: string;
    subject: string;
    content: string;
  }>();

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['admin_campaigns'],
    queryFn: async () => {
      const { data } = await apiClient.get('/campaigns');
      return data.data;
    },
  });

  const { data: allProducts } = useQuery({
    queryKey: ['admin_products_simple'],
    queryFn: async () => {
      const { data } = await apiClient.get('/products');
      return data.data || [];
    },
  });

  const filteredProducts = (allProducts || []).filter((p: Product) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const toggleProduct = (id: number) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/campaigns', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_campaigns'] });
      toast.success('Campaign created');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error creating campaign')
  });

  const sendMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.post(`/campaigns/${id}/send`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Campaign jobs queued');
      queryClient.invalidateQueries({ queryKey: ['admin_campaigns'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error sending campaign')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_campaigns'] });
      toast.success('Campaign deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error deleting campaign')
  });

  const openModal = () => {
    reset();
    setSelectedProductIds([]);
    setProductSearch('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedProductIds([]);
    setProductSearch('');
  };

  const onSubmit = (data: any) => {
    const payload = { ...data, productIds: selectedProductIds };
    createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSend = (id: number) => {
    if (confirm('Are you sure you want to trigger sending this campaign? This will queue emails for all eligible users.')) {
      sendMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and send marketing campaigns</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Campaign
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
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Subject</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                campaigns?.map((campaign: Campaign) => (
                  <tr key={campaign.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{campaign.id}</td>
                    <td className="px-6 py-4 font-medium">{campaign.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{campaign.subject}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSend(campaign.id)}
                          title="Send Campaign"
                          disabled={sendMutation.isPending}
                          className="p-2 text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-primary/10 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          title="Delete Campaign"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border p-6 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Create Campaign</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Internal Title</label>
                <input
                  {...register('title', { required: true })}
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Summer Sale 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Subject</label>
                <input
                  {...register('subject', { required: true })}
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Big discounts on Brake Pads!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content (HTML allowed)</label>
                <textarea
                  {...register('content', { required: true })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-32 resize-none"
                  placeholder="<p>Check out our latest offers!</p>"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Products
                  {selectedProductIds.length > 0 && (
                    <span className="ml-2 text-xs text-primary font-normal">({selectedProductIds.length} selected)</span>
                  )}
                </label>
                {/* Search */}
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                {/* Product list */}
                <div className="max-h-44 overflow-y-auto rounded-md border border-input bg-background">
                  {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center py-6 text-muted-foreground">
                      <Package className="h-6 w-6 mb-1 opacity-40" />
                      <span className="text-xs">No products found</span>
                    </div>
                  ) : (
                    filteredProducts.map((product: Product) => {
                      const isSelected = selectedProductIds.includes(product.id);
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => toggleProduct(product.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left transition-colors border-b border-border last:border-b-0 ${
                            isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                          }`}
                        >
                          <span>{product.name}</span>
                          {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                        </button>
                      );
                    })
                  )}
                </div>
                {selectedProductIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedProductIds.map(id => {
                      const p = (allProducts || []).find((x: Product) => x.id === id);
                      return p ? (
                        <span key={id} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs rounded-full px-2.5 py-1">
                          {p.name}
                          <button type="button" onClick={() => toggleProduct(id)} className="hover:text-primary/70">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1.5">Users who saved compatible vehicles will receive this campaign email.</p>
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
                  disabled={createMutation.isPending}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
