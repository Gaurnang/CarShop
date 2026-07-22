import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2, Plus, Edit, Trash2, X, ImagePlus, Upload, GitFork } from 'lucide-react';

interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
}

const ImageUploadModal: React.FC<{ productId: number; productName: string; onClose: () => void }> = ({ productId, productName, onClose }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  const { data: existingImages, isLoading: imagesLoading } = useQuery<ProductImage[]>({
    queryKey: ['product_images', productId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${productId}`);
      return data.data?.images || [];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      const { data } = await apiClient.post(`/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Images uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      queryClient.invalidateQueries({ queryKey: ['product_images', productId] });
      setPreviews([]);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Upload failed')
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews(prev => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePreview = (idx: number) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border border-border p-6 my-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Product Images</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{productName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Existing Images */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Current Images ({existingImages?.length || 0})</p>
          {imagesLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : existingImages && existingImages.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img: ProductImage) => (
                <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No images uploaded yet.</p>
          )}
        </div>

        {/* Upload new images */}
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium mb-2">Upload New Images</p>
          <div
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Click to select images</p>
            <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG up to 10MB each</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {previews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {previews.map((p, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePreview(idx)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-background/80 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-muted transition-colors"
          >
            Done
          </button>
          {previews.length > 0 && (
            <button
              onClick={() => uploadMutation.mutate(previews.map(p => p.file))}
              disabled={uploadMutation.isPending}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {uploadMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Upload {previews.length} image{previews.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_name: string;
  category_id: number;
  is_active: boolean;
  image_url?: string;
}

interface Category {
  id: number;
  name: string;
}

interface CompatibleVariant {
  variant_id: number;
  variant_name: string;
  model_name: string;
  brand_name: string;
}

const CompatibilityModal: React.FC<{ productId: number; productName: string; onClose: () => void }> = ({ productId, productName, onClose }) => {
  const queryClient = useQueryClient();
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');

  const { data: compatible, isLoading: compatLoading } = useQuery<CompatibleVariant[]>({
    queryKey: ['compatibility', productId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/${productId}/compatibility`);
      return data.data;
    }
  });

  const { data: allVariants } = useQuery({
    queryKey: ['all_variants'],
    queryFn: async () => {
      const { data } = await apiClient.get('/variants');
      return data.data;
    }
  });

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await apiClient.get('/brands');
      return data.data;
    }
  });

  const { data: models } = useQuery({
    queryKey: ['models', brandId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/models/brand/${brandId}`);
      return data.data;
    },
    enabled: !!brandId
  });

  const { data: variants } = useQuery({
    queryKey: ['variants', modelId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/variants/model/${modelId}`);
      return data.data;
    },
    enabled: !!modelId
  });

  const addMutation = useMutation({
    mutationFn: async (variantIds: number[]) => {
      const { data } = await apiClient.post(`/products/${productId}/compatibility`, { variantIds });
      return data;
    },
    onSuccess: () => {
      toast.success('Compatibility added');
      queryClient.invalidateQueries({ queryKey: ['compatibility', productId] });
      setSelectedVariantId('');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to add')
  });

  const removeMutation = useMutation({
    mutationFn: async (variantId: number) => {
      await apiClient.delete(`/products/${productId}/compatibility/${variantId}`);
    },
    onSuccess: () => {
      toast.success('Removed');
      queryClient.invalidateQueries({ queryKey: ['compatibility', productId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to remove')
  });

  const makeUniversal = () => {
    if (!allVariants || allVariants.length === 0) return;
    const existingIds = new Set((compatible || []).map((c: CompatibleVariant) => c.variant_id));
    const toAdd = allVariants
      .map((v: any) => v.id)
      .filter((id: number) => !existingIds.has(id));
    if (toAdd.length === 0) {
      toast.info('Product is already compatible with all variants.');
      return;
    }
    addMutation.mutate(toAdd);
  };

  const handleAdd = () => {
    if (!selectedVariantId) return;
    addMutation.mutate([Number(selectedVariantId)]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-xl border border-border p-6 my-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Vehicle Compatibility</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{productName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Make Universal */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Make Universal</p>
            <p className="text-xs text-muted-foreground">Compatible with ALL variants in the system.</p>
          </div>
          <button
            onClick={makeUniversal}
            disabled={addMutation.isPending}
            className="shrink-0 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            {addMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Make Universal
          </button>
        </div>

        {/* Add specific variant */}
        <div className="space-y-3 mb-5">
          <p className="text-sm font-medium">Add Specific Vehicle</p>
          <div className="grid grid-cols-1 gap-2">
            <select
              value={brandId}
              onChange={e => { setBrandId(e.target.value); setModelId(''); setSelectedVariantId(''); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">1. Select Brand</option>
              {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select
              value={modelId}
              disabled={!brandId}
              onChange={e => { setModelId(e.target.value); setSelectedVariantId(''); }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
            >
              <option value="">2. Select Model</option>
              {models?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <div className="flex gap-2">
              <select
                value={selectedVariantId}
                disabled={!modelId}
                onChange={e => setSelectedVariantId(e.target.value)}
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
              >
                <option value="">3. Select Variant/Trim</option>
                {variants?.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <button
                onClick={handleAdd}
                disabled={!selectedVariantId || addMutation.isPending}
                className="px-4 h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Current compatible variants */}
        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium mb-3">
            Currently Compatible ({compatible?.length || 0} variant{(compatible?.length || 0) !== 1 ? 's' : ''})
          </p>
          {compatLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
          ) : compatible && compatible.length > 0 ? (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {compatible.map((c: CompatibleVariant) => (
                <div key={c.variant_id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm bg-muted/20">
                  <span>
                    <span className="text-muted-foreground">{c.brand_name} {c.model_name} — </span>
                    <span className="font-medium">{c.variant_name}</span>
                  </span>
                  <button
                    onClick={() => removeMutation.mutate(c.variant_id)}
                    className="ml-2 p-1 text-muted-foreground hover:text-destructive transition-colors rounded"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No vehicles assigned yet. This product won't appear in filtered catalog results.</p>
          )}
        </div>

        <div className="flex justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium border border-input rounded-md hover:bg-muted transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUploadProduct, setImageUploadProduct] = useState<Product | null>(null);
  const [compatibilityProduct, setCompatibilityProduct] = useState<Product | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<{
    name: string;
    description: string;
    price: number;
    categoryId: number;
    isActive: boolean;
    imageUrl?: string;
  }>();

  const { data: response, isLoading } = useQuery({
    queryKey: ['admin_products'],
    queryFn: async () => {
      const { data } = await apiClient.get('/products');
      return data;
    },
  });

  const products = response?.data || [];

  const { data: categories } = useQuery({
    queryKey: ['admin_categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories');
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await apiClient.post('/products', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      toast.success('Product created');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error creating product')
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: number; data: any }) => {
      const { data } = await apiClient.put(`/products/${payload.id}`, payload.data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      toast.success('Product updated');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error updating product')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_products'] });
      toast.success('Product deleted');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Error deleting product')
  });

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('categoryId', product.category_id);
      setValue('isActive', product.is_active);
      setValue('imageUrl', product.image_url);
    } else {
      setEditingId(null);
      reset();
      setValue('isActive', true);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setEditingId(null);
  };

  const onSubmit = (data: any) => {
    const payload = { ...data, price: Number(data.price), categoryId: Number(data.categoryId) };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage catalog products</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Product
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-semibold w-24">ID</th>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product: Product) => (
                    <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{product.id}</td>
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{product.category_name}</td>
                      <td className="px-6 py-4">${Number(product.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setCompatibilityProduct(product)}
                            title="Manage Compatibility"
                            className="p-2 text-muted-foreground hover:text-green-600 transition-colors rounded-md hover:bg-green-600/10"
                          >
                            <GitFork className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setImageUploadProduct(product)}
                            title="Manage Images"
                            className="p-2 text-muted-foreground hover:text-blue-500 transition-colors rounded-md hover:bg-blue-500/10"
                          >
                            <ImagePlus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openModal(product)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
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
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border p-6 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Product' : 'Create Product'}</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  {...register('categoryId', { required: true })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a category...</option>
                  {categories?.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  {...register('name', { required: true })}
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. Brake Pads"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring h-24 resize-none"
                  placeholder="Product description..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input
                  {...register('price', { required: true })}
                  type="number"
                  step="0.01"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0.00"
                />
              </div>
              {editingId && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" {...register('isActive')} className="rounded border-input" />
                    Active Status
                  </label>
                </div>
              )}
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

      {imageUploadProduct && (
        <ImageUploadModal
          productId={imageUploadProduct.id}
          productName={imageUploadProduct.name}
          onClose={() => setImageUploadProduct(null)}
        />
      )}

      {compatibilityProduct && (
        <CompatibilityModal
          productId={compatibilityProduct.id}
          productName={compatibilityProduct.name}
          onClose={() => setCompatibilityProduct(null)}
        />
      )}
    </div>
  );
};
