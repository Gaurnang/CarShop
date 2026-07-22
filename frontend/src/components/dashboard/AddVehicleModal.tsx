import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';
import { useAddSavedCar } from '@/hooks/useSavedCars';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddVehicleModalProps {
  onClose: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [nickname, setNickname] = useState('');

  const addCarMutation = useAddSavedCar();

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data } = await apiClient.get('/brands');
      return data.data;
    }
  });

  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['models', selectedBrand],
    queryFn: async () => {
      const { data } = await apiClient.get(`/models/brand/${selectedBrand}`);
      return data.data;
    },
    enabled: !!selectedBrand
  });

  const { data: variants, isLoading: variantsLoading } = useQuery({
    queryKey: ['variants', selectedModel],
    queryFn: async () => {
      const { data } = await apiClient.get(`/variants/model/${selectedModel}`);
      return data.data;
    },
    enabled: !!selectedModel
  });

  const handleSave = () => {
    if (!selectedVariant) return;
    
    addCarMutation.mutate({
      variantId: selectedVariant,
      nickname: nickname.trim() || undefined
    }, {
      onSuccess: () => {
        toast.success('Vehicle added to your garage!');
        onClose();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to add vehicle');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-lg">Add a Vehicle</h3>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h4 className="text-sm font-medium text-muted-foreground">Select Brand</h4>
              {brandsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {brands?.map((b: any) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedBrand(b.id); setStep(2); }}
                      className="text-left px-4 py-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline">Brands</button>
                <span className="text-muted-foreground text-xs">&gt;</span>
                <h4 className="text-sm font-medium text-muted-foreground">Select Model</h4>
              </div>
              
              {modelsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : models?.length === 0 ? (
                <p className="text-sm text-center py-4 text-muted-foreground">No models found for this brand.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {models?.map((m: any) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m.id); setStep(3); }}
                      className="text-left px-4 py-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(2)} className="text-xs text-primary hover:underline">Models</button>
                <span className="text-muted-foreground text-xs">&gt;</span>
                <h4 className="text-sm font-medium text-muted-foreground">Select Trim / Variant</h4>
              </div>

              {variantsLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : variants?.length === 0 ? (
                <p className="text-sm text-center py-4 text-muted-foreground">No variants found for this model.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {variants?.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => { setSelectedVariant(v.id); setStep(4); }}
                      className="text-left px-4 py-3 rounded-md border border-border hover:border-primary hover:bg-primary/5 transition-colors flex justify-between items-center"
                    >
                      <span>{v.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setStep(3)} className="text-xs text-primary hover:underline">Variants</button>
                <span className="text-muted-foreground text-xs">&gt;</span>
                <h4 className="text-sm font-medium text-muted-foreground">Final Details</h4>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nickname (Optional)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. My Daily Driver"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">Give your vehicle a recognizable name.</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 text-sm rounded-md border border-input hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={addCarMutation.isPending}
                  className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {addCarMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Vehicle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
