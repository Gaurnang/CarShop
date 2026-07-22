import React, { useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { ProductCard } from '@/components/products/ProductCard';
import { Loader2, Search, Package, Filter, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSavedCars } from '@/hooks/useSavedCars';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';

export const CatalogPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showVehicleFilter, setShowVehicleFilter] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const selectedCarId = searchParams.get('savedCarId') || '';
  const categoryId = searchParams.get('category') || '';
  const sortOption = searchParams.get('sort') || '';
  
  // Custom vehicle filter
  const brandId = searchParams.get('brand') || '';
  const modelId = searchParams.get('model') || '';
  const variantId = searchParams.get('variant') || '';

  const setParam = (key: string, value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      if (key !== 'page') newParams.set('page', '1'); // Reset page on filter change
      return newParams;
    });
  };

  const { data: savedCarsData } = useSavedCars({ enabled: isAuthenticated });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get('/categories');
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

  const { data, isLoading, isError } = useCatalog({
    page,
    limit: 12,
    search: search || undefined,
    savedCarId: selectedCarId || undefined,
    variantId: variantId ? Number(variantId) : undefined,
    categoryId: categoryId ? Number(categoryId) : undefined,
    sort: sortOption ? 'price' : undefined,
    order: sortOption === 'price_desc' ? 'DESC' : (sortOption === 'price_asc' ? 'ASC' : undefined)
  });

  if (isAdmin) {
    return <Navigate to="/admin/brands" replace />;
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Shop All Parts</h1>
        <p className="text-muted-foreground">
          Find the perfect parts and accessories for your vehicle.
        </p>
      </div>

      <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-auto min-w-[140px]">
              <select
                value={categoryId}
                onChange={(e) => setParam('category', e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">All Categories</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-auto min-w-[140px]">
              <select
                value={sortOption}
                onChange={(e) => setParam('sort', e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Sort By (Default)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {isAuthenticated && savedCarsData && savedCarsData.length > 0 && (
              <div className="w-full sm:w-auto min-w-[180px]">
                <select
                  value={selectedCarId}
                  onChange={(e) => {
                    setParam('savedCarId', e.target.value);
                    if (e.target.value) {
                      setParam('brand', '');
                      setParam('model', '');
                      setParam('variant', '');
                    }
                  }}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">All Vehicles (No Filter)</option>
                  {savedCarsData.map((car: any) => (
                    <option key={car.id} value={car.id}>
                      {car.nickname || `${car.brand_name} ${car.model_name}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={() => setShowVehicleFilter(!showVehicleFilter)}
              className={`flex items-center gap-2 h-10 px-3 rounded-md border text-sm font-medium transition-colors ${showVehicleFilter || variantId ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input hover:bg-muted'}`}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Custom Vehicle</span>
            </button>
          </div>
        </div>

        {(showVehicleFilter || variantId || brandId) && (
          <div className="pt-4 border-t border-border mt-2 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Filter by Specific Vehicle</h3>
              {(brandId || modelId || variantId) && (
                <button 
                  onClick={() => {
                    setParam('brand', '');
                    setParam('model', '');
                    setParam('variant', '');
                  }}
                  className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" /> Clear Vehicle
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <select
                value={brandId}
                onChange={(e) => {
                  setParam('brand', e.target.value);
                  setParam('model', '');
                  setParam('variant', '');
                  setParam('savedCarId', ''); // Reset saved car if using custom filter
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">1. Select Brand</option>
                {brands?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>

              <select
                value={modelId}
                onChange={(e) => {
                  setParam('model', e.target.value);
                  setParam('variant', '');
                }}
                disabled={!brandId}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="">2. Select Model</option>
                {models?.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>

              <select
                value={variantId}
                onChange={(e) => setParam('variant', e.target.value)}
                disabled={!modelId}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="">3. Select Variant</option>
                {variants?.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div>
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="rounded-lg bg-destructive/10 p-6 text-center border border-destructive/20 text-destructive">
            <h3 className="font-semibold mb-1">Connection Error</h3>
            <p className="text-sm opacity-90">We couldn't load the catalog. Please try again later.</p>
          </div>
        ) : data?.data?.products?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-lg border border-dashed border-border bg-card">
            <Package className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-semibold text-lg">No products found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              We couldn't find any products matching your search criteria or vehicle filter.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.data.products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {data.data.pagination && data.data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-4">
                <button
                  disabled={page === 1}
                  onClick={() => setParam('page', String(page - 1))}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                  Page {page} of {data.data.pagination.totalPages}
                </span>
                <button
                  disabled={page === data.data.pagination.totalPages}
                  onClick={() => setParam('page', String(page + 1))}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
